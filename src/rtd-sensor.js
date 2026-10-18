import { generateLabReportPdf } from "./pdf-export.js";

const SENSOR_MODELS = {
    pt100: { id: "pt100", name: "Pt100", r0: 100, tcr: 0.00385, color: "#14b8a6" },
    pt1000: { id: "pt1000", name: "Pt1000", r0: 1000, tcr: 0.00385, color: "#38bdf8" }
};

const CALLENDAR_VAN_DUSEN = { a: 3.9083e-3, b: -5.775e-7, c: -4.183e-12 };

export function createRtdSensorExperiment(callbacks = {}) {
    const {
        onXpAwarded,
        onExperimentRecorded,
        onChallengeCompleted,
        showToast,
        unlockBadge
    } = callbacks;

    const state = {
        sensorId: "pt100",
        temperatureC: 25,
        excitationMa: 1,
        wiring: "4-wire",
        powerOn: true,
        observations: [],
        challenges: {
            calibrationSweep: false,
            determineTcr: false,
            leadCompensation: false
        },
        calculatedTcr: 0,
        calculatedErrorPct: 0
    };

    let apparatusCanvas;
    let apparatusCtx;
    let graphCanvas;
    let graphCtx;
    let eventsBound = false;

    function getSensor() {
        return SENSOR_MODELS[state.sensorId] || SENSOR_MODELS.pt100;
    }

    function resistanceAtTemperature(temperatureC, sensor = getSensor()) {
        const { a, b, c } = CALLENDAR_VAN_DUSEN;
        const t = temperatureC;
        const correction = t < 0 ? c * (t - 100) * t ** 3 : 0;
        return sensor.r0 * (1 + a * t + b * t ** 2 + correction);
    }

    function leadOffsetOhm() {
        if (state.wiring === "2-wire") return 0.7;
        if (state.wiring === "3-wire") return 0.015;
        return 0;
    }

    function getSelfHeatingC() {
        if (!state.powerOn) return 0;
        const currentA = state.excitationMa / 1000;
        const resistance = resistanceAtTemperature(state.temperatureC);
        return currentA ** 2 * resistance * 500;
    }

    function readResistance(withNoise = false) {
        const sensor = getSensor();
        const sensedTemp = state.temperatureC + getSelfHeatingC();
        const idealOhm = resistanceAtTemperature(sensedTemp, sensor);
        const noise = withNoise ? (Math.random() - 0.5) * (sensor.r0 === 100 ? 0.06 : 0.6) : 0;
        const rawOhm = idealOhm + leadOffsetOhm() + noise;
        return {
            rawOhm: Math.round(rawOhm * (sensor.r0 === 100 ? 100 : 10)) / (sensor.r0 === 100 ? 100 : 10),
            correctedOhm: rawOhm - leadOffsetOhm()
        };
    }

    function invertResistance(resistanceOhm, sensor = getSensor()) {
        let low = -200;
        let high = 850;
        for (let index = 0; index < 48; index += 1) {
            const middle = (low + high) / 2;
            if (resistanceAtTemperature(middle, sensor) < resistanceOhm) low = middle;
            else high = middle;
        }
        return (low + high) / 2;
    }

    function getCurrentSensorObservations() {
        return state.observations
            .filter(observation => observation.sensorId === state.sensorId)
            .sort((a, b) => a.temperatureC - b.temperatureC);
    }

    function fitLine(points) {
        if (points.length < 2) return null;
        const count = points.length;
        const sumX = points.reduce((sum, point) => sum + point.temperatureC, 0);
        const sumY = points.reduce((sum, point) => sum + point.correctedOhm, 0);
        const sumXY = points.reduce((sum, point) => sum + point.temperatureC * point.correctedOhm, 0);
        const sumXX = points.reduce((sum, point) => sum + point.temperatureC ** 2, 0);
        const denominator = count * sumXX - sumX ** 2;
        if (denominator === 0) return null;
        const slope = (count * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / count;
        return Number.isFinite(slope) && Number.isFinite(intercept) ? { slope, intercept } : null;
    }

    function completeChallenge(key, challengeId, xp, name, badgeId, badgeTitle) {
        if (state.challenges[key]) return;
        state.challenges[key] = true;
        renderChallenges();
        if (typeof onChallengeCompleted === "function") {
            onChallengeCompleted({ challengeId, xp, name, title: name, badgeId, badgeTitle });
        } else {
            onXpAwarded?.(xp, name);
            if (badgeId) unlockBadge?.(badgeId, badgeTitle);
        }
        showToast?.(`Challenge complete: ${name} (+${xp} XP)`);
    }

    function renderChallenges() {
        const list = document.getElementById("rtd-missions-list");
        if (!list) return;
        const missions = [
            ["calibrationSweep", "Calibration sweep", "Record five distinct bath temperatures.", "+100 XP"],
            ["determineTcr", "Determine platinum TCR", "Fit four or more points from 0 to 100 °C within 2% of nominal α.", "+200 XP"],
            ["leadCompensation", "Lead-wire compensation", "Compare two-wire and four-wire readings at the same temperature.", "+150 XP"]
        ];
        list.innerHTML = missions.map(([key, title, description, reward]) => `
      <div class="rtd-mission ${state.challenges[key] ? "completed" : ""}">
        <div><strong>${state.challenges[key] ? "✓ " : ""}${title}</strong><p>${description}</p></div>
        <span>${reward}</span>
      </div>
    `).join("");
    }

    function renderApparatus() {
        if (!apparatusCanvas || !apparatusCtx) return;
        const ctx = apparatusCtx;
        const width = apparatusCanvas.clientWidth || apparatusCanvas.width;
        const height = apparatusCanvas.clientHeight || apparatusCanvas.height;
        const sensor = getSensor();
        ctx.clearRect(0, 0, width, height);

        const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";
        ctx.fillStyle = isLight ? "#f8fafc" : "#07141b";
        ctx.fillRect(0, 0, width, height);

        const bathLeft = width * 0.12;
        const bathTop = height * 0.26;
        const bathWidth = width * 0.76;
        const bathHeight = height * 0.57;
        ctx.fillStyle = isLight ? "rgba(20, 184, 166, 0.08)" : "rgba(20, 184, 166, 0.13)";
        ctx.fillRect(bathLeft, bathTop, bathWidth, bathHeight);
        ctx.strokeStyle = isLight ? "#94a3b8" : "#64748b";
        ctx.lineWidth = 2;
        ctx.strokeRect(bathLeft, bathTop, bathWidth, bathHeight);
        ctx.fillStyle = isLight ? "rgba(20, 184, 166, 0.22)" : "rgba(20, 184, 166, 0.3)";
        ctx.fillRect(bathLeft + 2, bathTop + bathHeight * 0.55, bathWidth - 4, bathHeight * 0.43);

        const probeX = width * 0.52;
        ctx.strokeStyle = isLight ? "#475569" : "#cbd5e1";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(probeX, 10);
        ctx.lineTo(probeX, bathTop + bathHeight * 0.8);
        ctx.stroke();
        ctx.fillStyle = sensor.color;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
            ctx.roundRect(probeX - 8, bathTop + bathHeight * 0.53, 16, bathHeight * 0.25, 7);
        } else {
            ctx.rect(probeX - 8, bathTop + bathHeight * 0.53, 16, bathHeight * 0.25);
        }
        ctx.fill();

        ctx.strokeStyle = state.powerOn ? sensor.color : "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(probeX, 10);
        ctx.lineTo(probeX, 0);
        ctx.lineTo(width * 0.83, 0);
        ctx.stroke();

        ctx.fillStyle = isLight ? "#0f172a" : "#e2e8f0";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${sensor.name} immersion probe`, bathLeft + 10, bathTop + 22);

        ctx.fillStyle = isLight ? "#0f766e" : "#99f6e4";
        ctx.font = "bold 17px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${state.temperatureC.toFixed(1)} °C`, width * 0.5, height - 8);

        ctx.fillStyle = isLight ? "#64748b" : "#94a3b8";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText(state.wiring, width * 0.88, bathTop + bathHeight + 18);
    }

    function renderGraph() {
        if (!graphCanvas || !graphCtx) return;
        const ctx = graphCtx;
        const width = graphCanvas.clientWidth || graphCanvas.width;
        const height = graphCanvas.clientHeight || graphCanvas.height;
        const left = 58;
        const right = 20;
        const top = 30;
        const bottom = 42;
        const plotWidth = width - left - right;
        const plotHeight = height - top - bottom;
        const observations = getCurrentSensorObservations();
        const sensor = getSensor();

        ctx.clearRect(0, 0, width, height);
        const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";
        ctx.fillStyle = isLight ? "#f8fafc" : "#07141b";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        for (let index = 0; index <= 5; index += 1) {
            const x = left + plotWidth * index / 5;
            const y = top + plotHeight * index / 5;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, height - bottom);
            ctx.moveTo(left, y);
            ctx.lineTo(width - right, y);
            ctx.stroke();
        }

        ctx.strokeStyle = isLight ? "#94a3b8" : "#64748b";
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(left, height - bottom);
        ctx.lineTo(width - right, height - bottom);
        ctx.stroke();

        ctx.fillStyle = isLight ? "#475569" : "#94a3b8";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("Bath temperature (°C)", left + plotWidth / 2, height - 10);

        ctx.save();
        ctx.translate(14, top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Corrected resistance (Ω)", 0, 0);
        ctx.restore();

        const minTemp = -50;
        const maxTemp = 250;
        const minOhm = sensor.r0 * 0.75;
        const maxOhm = sensor.r0 * 2.0;
        const xFor = temp => left + (temp - minTemp) / (maxTemp - minTemp) * plotWidth;
        const yFor = ohm => height - bottom - (ohm - minOhm) / (maxOhm - minOhm) * plotHeight;

        ctx.strokeStyle = "rgba(20, 184, 166, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let temp = minTemp; temp <= maxTemp; temp += 2) {
            const x = xFor(temp);
            const y = yFor(resistanceAtTemperature(temp, sensor));
            if (temp === minTemp) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        observations.forEach(observation => {
            ctx.fillStyle = sensor.color;
            ctx.beginPath();
            ctx.arc(xFor(observation.temperatureC), yFor(observation.correctedOhm), 4, 0, Math.PI * 2);
            ctx.fill();
        });

        const fit = fitLine(observations);
        if (fit && observations.length >= 2) {
            ctx.strokeStyle = isLight ? "#d97706" : "#fbbf24";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(xFor(minTemp), yFor(fit.slope * minTemp + fit.intercept));
            ctx.lineTo(xFor(maxTemp), yFor(fit.slope * maxTemp + fit.intercept));
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function updateTelemetry() {
        const sensor = getSensor();
        const reading = readResistance(false);
        const current = document.getElementById("rtd-current-temp");
        const currentR = document.getElementById("rtd-current-resistance");
        const currentLead = document.getElementById("rtd-current-lead");
        const selfHeating = document.getElementById("rtd-self-heating");
        const kpiSensor = document.getElementById("rtd-kpi-sensor");
        const kpiTemp = document.getElementById("rtd-kpi-temp");
        const kpiResistance = document.getElementById("rtd-kpi-resistance");
        const kpiTcr = document.getElementById("rtd-kpi-tcr");
        const kpiError = document.getElementById("rtd-kpi-error");
        const kpiCount = document.getElementById("rtd-kpi-count");
        const temperatureSlider = document.getElementById("rtd-temp-slider");
        const temperatureLabel = document.getElementById("rtd-temp-slider-val");
        const currentLabel = document.getElementById("rtd-current-slider-val");
        if (current) current.textContent = `${state.temperatureC.toFixed(1)} °C`;
        if (currentR) currentR.textContent = `${reading.rawOhm.toFixed(sensor.r0 === 100 ? 2 : 1)} Ω`;
        if (currentLead) currentLead.textContent = `${leadOffsetOhm().toFixed(3)} Ω`;
        if (selfHeating) selfHeating.textContent = `${getSelfHeatingC().toFixed(3)} °C`;
        if (kpiSensor) kpiSensor.textContent = sensor.name;
        if (kpiTemp) kpiTemp.textContent = `${state.temperatureC.toFixed(1)} °C`;
        if (kpiResistance) kpiResistance.textContent = `${reading.rawOhm.toFixed(sensor.r0 === 100 ? 2 : 1)} Ω`;
        if (kpiTcr) kpiTcr.textContent = state.calculatedTcr > 0 ? `${state.calculatedTcr.toFixed(6)} °C⁻¹` : "—";
        if (kpiError) kpiError.textContent = state.calculatedTcr > 0 ? `${state.calculatedErrorPct.toFixed(2)}%` : "—";
        if (kpiCount) kpiCount.textContent = `${state.observations.length} readings`;
        if (temperatureSlider) temperatureSlider.value = String(state.temperatureC);
        if (temperatureLabel) temperatureLabel.textContent = `${state.temperatureC.toFixed(1)} °C`;
        if (currentLabel) currentLabel.textContent = `${state.excitationMa.toFixed(1)} mA`;
        const powerButton = document.getElementById("rtd-btn-power");
        const powerLed = document.getElementById("rtd-power-led");
        if (powerButton) {
            powerButton.textContent = state.powerOn ? "Supply ON" : "Supply OFF";
            powerButton.classList.toggle("active", state.powerOn);
        }
        powerLed?.classList.toggle("active", state.powerOn);
    }

    function renderTable() {
        const body = document.getElementById("rtd-obs-table-body");
        const empty = document.getElementById("rtd-obs-empty");
        const badge = document.getElementById("rtd-obs-count-badge");
        if (!body) return;
        empty?.classList.toggle("hidden", state.observations.length > 0);
        if (badge) badge.textContent = `${state.observations.length} readings`;
        body.innerHTML = state.observations.map((observation, index) => `
      <tr>
        <td>${index + 1}</td><td>${observation.sensorName}</td>
        <td>${observation.temperatureC.toFixed(1)} °C</td>
        <td>${observation.rawOhm.toFixed(observation.sensorId === "pt100" ? 2 : 1)} Ω</td>
        <td>${observation.correctedOhm.toFixed(observation.sensorId === "pt100" ? 2 : 1)} Ω</td>
        <td>${observation.estimatedTempC.toFixed(2)} °C</td><td>${observation.wiring}</td>
      </tr>
    `).join("");
    }

    function updateAnalysis() {
        const observations = getCurrentSensorObservations();
        const tcrPoints = observations.filter(observation => observation.temperatureC >= 0 && observation.temperatureC <= 100);
        const fit = fitLine(tcrPoints);
        state.calculatedTcr = fit && fit.intercept > 0 ? fit.slope / fit.intercept : 0;
        state.calculatedErrorPct = state.calculatedTcr > 0
            ? Math.abs((state.calculatedTcr - getSensor().tcr) / getSensor().tcr) * 100
            : 0;
        renderGraph();
        updateTelemetry();

        const distinctTemperatures = new Set(state.observations.map(observation => observation.temperatureC));
        if (distinctTemperatures.size >= 5) {
            completeChallenge("calibrationSweep", "rtd.calibrationSweep", 100, "RTD Calibration Sweep");
        }
        const tcrTemperatures = new Set(tcrPoints.map(observation => observation.temperatureC));
        if (tcrTemperatures.size >= 4 && state.calculatedErrorPct <= 2) {
            completeChallenge("determineTcr", "rtd.determineTcr", 200, "Platinum TCR Determination", "badge-rtd-calibration", "Precision Calibrator");
        }
        const twoWireReading = state.observations.find(observation => observation.temperatureC === state.temperatureC && observation.wiring === "2-wire");
        const fourWireReading = state.observations.find(observation => observation.temperatureC === state.temperatureC && observation.wiring === "4-wire");
        if (twoWireReading && fourWireReading && twoWireReading.rawOhm - fourWireReading.rawOhm >= 0.5) {
            completeChallenge("leadCompensation", "rtd.leadCompensation", 150, "Lead-Wire Compensation", null, null);
        }
        renderChallenges();
    }

    function renderAll() {
        renderApparatus();
        renderTable();
        updateAnalysis();
    }

    function recordMeasurement() {
        if (!state.powerOn) {
            showToast?.("Turn on the measurement supply before recording the RTD.");
            return;
        }
        const sensor = getSensor();
        const reading = readResistance(true);
        const observation = {
            sensorId: sensor.id,
            sensorName: sensor.name,
            temperatureC: state.temperatureC,
            rawOhm: reading.rawOhm,
            correctedOhm: reading.correctedOhm,
            estimatedTempC: invertResistance(reading.correctedOhm, sensor),
            wiring: state.wiring,
            excitationMa: state.excitationMa,
            timestamp: new Date().toISOString()
        };
        state.observations.push(observation);
        onXpAwarded?.(20, `${sensor.name} reading recorded`);
        onExperimentRecorded?.("rtd-sensor", {
            trial: state.observations.length,
            sensor: sensor.name,
            temperatureC: observation.temperatureC,
            resistanceOhm: observation.rawOhm,
            correctedResistanceOhm: observation.correctedOhm,
            estimatedTemperatureC: observation.estimatedTempC,
            wiring: observation.wiring
        });
        showToast?.(`Recorded ${sensor.name}: ${observation.rawOhm.toFixed(sensor.r0 === 100 ? 2 : 1)} Ω at ${state.temperatureC.toFixed(1)} °C`);
        renderAll();
    }

    function exportCsv() {
        if (!state.observations.length) {
            showToast?.("No RTD readings available to export.");
            return;
        }
        const rows = [
            ["Trial", "Sensor", "Bath temperature (C)", "Measured resistance (ohm)", "Lead-corrected resistance (ohm)", "Estimated temperature (C)", "Wiring", "Excitation (mA)", "Timestamp"],
            ...state.observations.map((observation, index) => [
                index + 1, observation.sensorName, observation.temperatureC.toFixed(2), observation.rawOhm.toFixed(3),
                observation.correctedOhm.toFixed(3), observation.estimatedTempC.toFixed(3), observation.wiring,
                observation.excitationMa.toFixed(1), observation.timestamp
            ])
        ];
        const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
        const link = document.createElement("a");
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
        link.download = `RTD_Calibration_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function exportPdf() {
        if (!state.observations.length) {
            showToast?.("Record at least one RTD reading before exporting a report.");
            return;
        }
        generateLabReportPdf({
            labTitle: "Resistance Temperature Detector Calibration",
            labSubtitle: "Pt100 / Pt1000 Callendar–Van Dusen calibration and lead-wire compensation",
            experimentCode: "EXP-13-RTD-SENSOR",
            experimentId: "rtd-sensor",
            stats: [
                { label: "Active sensor", value: getSensor().name },
                { label: "Recorded readings", value: String(state.observations.length) },
                { label: "Measured TCR", value: state.calculatedTcr > 0 ? `${state.calculatedTcr.toFixed(6)} °C⁻¹` : "Pending" },
                { label: "TCR relative error", value: state.calculatedTcr > 0 ? `${state.calculatedErrorPct.toFixed(2)}%` : "Pending" }
            ],
            tableHeaders: ["Trial", "Sensor", "Bath T (°C)", "Measured R (Ω)", "Corrected R (Ω)", "Estimated T (°C)", "Wiring"],
            tableRows: state.observations.map((observation, index) => [
                String(index + 1), observation.sensorName, observation.temperatureC.toFixed(1), observation.rawOhm.toFixed(3),
                observation.correctedOhm.toFixed(3), observation.estimatedTempC.toFixed(2), observation.wiring
            ]),
            conclusions: [
                "The platinum resistance thermometer was evaluated using the Callendar–Van Dusen relation.",
                `The fitted temperature coefficient was ${state.calculatedTcr > 0 ? state.calculatedTcr.toFixed(6) : "not yet determined"} °C⁻¹.`,
                "Two-wire lead resistance and four-wire Kelvin compensation were compared using measured calibration readings."
            ]
        });
    }

    function bindEvents() {
        if (eventsBound) return;
        eventsBound = true;

        document.getElementById("rtd-sensor-select")?.addEventListener("change", event => {
            state.sensorId = SENSOR_MODELS[event.target.value] ? event.target.value : "pt100";
            renderAll();
        });
        document.getElementById("rtd-temp-slider")?.addEventListener("input", event => {
            state.temperatureC = Number(event.target.value);
            renderAll();
        });
        document.getElementById("rtd-current-slider")?.addEventListener("input", event => {
            state.excitationMa = Number(event.target.value);
            renderAll();
        });
        document.getElementById("rtd-wiring-select")?.addEventListener("change", event => {
            state.wiring = event.target.value;
            renderAll();
        });
        document.getElementById("rtd-btn-power")?.addEventListener("click", () => {
            state.powerOn = !state.powerOn;
            renderAll();
        });
        document.getElementById("rtd-btn-record")?.addEventListener("click", recordMeasurement);
        document.getElementById("rtd-btn-export-csv")?.addEventListener("click", exportCsv);
        document.getElementById("rtd-btn-export-pdf")?.addEventListener("click", exportPdf);
        document.getElementById("rtd-btn-clear")?.addEventListener("click", () => {
            if (!state.observations.length || !confirm("Clear all recorded RTD calibration readings?")) return;
            state.observations = [];
            state.calculatedTcr = 0;
            state.calculatedErrorPct = 0;
            renderAll();
            showToast?.("RTD calibration logbook cleared.");
        });
    }

    function resizeCanvases() {
        [[apparatusCanvas, apparatusCtx], [graphCanvas, graphCtx]].forEach(([canvas, ctx]) => {
            if (!canvas || !ctx) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.round(rect.width * dpr));
            canvas.height = Math.max(1, Math.round(rect.height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        });
        renderAll();
    }

    function init() {
        apparatusCanvas = document.getElementById("rtd-apparatus-canvas");
        apparatusCtx = apparatusCanvas?.getContext("2d");
        graphCanvas = document.getElementById("rtd-graph-canvas");
        graphCtx = graphCanvas?.getContext("2d");
        bindEvents();
        renderChallenges();
        renderAll();
        window.addEventListener("resize", resizeCanvases);
        setTimeout(resizeCanvases, 50);
    }

    function hydrateChallenges(completedIds = []) {
        state.challenges.calibrationSweep ||= completedIds.includes("rtd.calibrationSweep");
        state.challenges.determineTcr ||= completedIds.includes("rtd.determineTcr");
        state.challenges.leadCompensation ||= completedIds.includes("rtd.leadCompensation");
        renderChallenges();
    }

    return {
        init,
        renderAll,
        hydrateChallenges,
        getState: () => ({ ...state, observations: [...state.observations], challenges: { ...state.challenges } })
    };
}
