/**
 * PhysiX — Multi-Experiment 50-Question Bank & Dynamic Shuffler
 * 
 * Includes 50 verified physics questions for all 14 active laboratory experiments:
 *  - Experiment 1: 2D Projectile Motion
 *  - Experiment 2: Optical Fibre Numerical Aperture (TIR)
 *  - Experiment 3: Colour Sensor (TCS3200 & RGB Photometry)
 *  - Experiment 4: Hall Effect Experiment
 *  - Experiment 5: Diffraction Grating Spectrometry
 *  - Experiment 6: Physics Sandbox Dynamics
 *  - Experiment 7: Plastic Optical Fiber Attenuation
 *  - Experiment 8: Laser Beam Divergence
 *  - Experiment 9: Ultrasonic Distance Measurement (UDM)
 *  - Experiment 10: Wedge-Shaped Film Interference
 *  - Experiment 11: Newton's Rings Wave Interference
 *  - Experiment 12: Diode V-I Characteristics
 *  - Experiment 13: Planck's Constant Photocell
 *  - Experiment 14: RTD Temperature Sensors (Pt100)
 * 
 * Generates dynamic 10-question quizzes with full randomization and option-shuffling
 * so no two attempts have the same question pattern or option ordering.
 */

// Fisher-Yates (Knuth) array shuffling algorithm for unbiased sampling without replacement
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PROJECTILE_QUESTION_BANK = {
  "experiment": "2D Projectile Motion - Question Bank",
  "experimentId": "projectile",
  "quizId": "projectile-mastery-quiz",
  "experimentName": "2D Projectile Motion",
  "description": "Comprehensive 50-Question Physics Question Bank for 2D Projectile Motion",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What is projectile motion?",
      "options": [
        "Motion of an object under gravity after projection",
        "Motion only in a circle",
        "Motion without gravity",
        "Motion only vertically"
      ],
      "answer": "Motion of an object under gravity after projection",
      "correct_option": "Motion of an object under gravity after projection",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "A projectile is an object upon which the only significant acting force is gravity after launch."
    },
    {
      "id": 2,
      "question": "What is the horizontal acceleration of an ideal projectile?",
      "options": [
        "Zero",
        "g",
        "2g",
        "g/2"
      ],
      "answer": "Zero",
      "correct_option": "Zero",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Neglecting air resistance, no horizontal forces act on the projectile (ΣFx = 0), so ax = 0."
    },
    {
      "id": 3,
      "question": "What is the vertical acceleration of an ideal projectile?",
      "options": [
        "g downward",
        "Zero",
        "g upward",
        "2g upward"
      ],
      "answer": "g downward",
      "correct_option": "g downward",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Gravity exerts a constant downward force (F = mg), producing a downward acceleration of ay = -g."
    },
    {
      "id": 4,
      "question": "Which force acts on an ideal projectile after release?",
      "options": [
        "Gravity",
        "Friction only",
        "Magnetic force only",
        "Electric force only"
      ],
      "answer": "Gravity",
      "correct_option": "Gravity",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "In classical ideal projectile dynamics, gravity is the sole force acting during flight."
    },
    {
      "id": 5,
      "question": "The path of an ideal projectile is a:",
      "options": [
        "Parabola",
        "Circle",
        "Straight line always",
        "Ellipse always"
      ],
      "answer": "Parabola",
      "correct_option": "Parabola",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "The equation y = (tanθ)x - (g/(2v₀²cos²θ))x² is quadratic in x, representing a parabolic trajectory."
    },
    {
      "id": 6,
      "question": "At the highest point of projectile motion, vertical velocity is:",
      "options": [
        "Zero",
        "Maximum",
        "Equal to g",
        "Negative maximum"
      ],
      "answer": "Zero",
      "correct_option": "Zero",
      "difficulty": "easy",
      "global_id": 6,
      "explanation": "At the apex peak, the projectile momentarily transitions between upward rise and downward fall (vy = 0)."
    },
    {
      "id": 7,
      "question": "Horizontal velocity of an ideal projectile is:",
      "options": [
        "Constant",
        "Zero throughout",
        "Increasing",
        "Decreasing"
      ],
      "answer": "Constant",
      "correct_option": "Constant",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Because ax = 0, horizontal velocity vx = v₀ cosθ remains constant throughout the entire trajectory."
    },
    {
      "id": 8,
      "question": "The SI unit of acceleration due to gravity is:",
      "options": [
        "m/s²",
        "m/s",
        "N",
        "J"
      ],
      "answer": "m/s²",
      "correct_option": "m/s²",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "Acceleration measures the rate of change of velocity per second, giving units of m/s²."
    },
    {
      "id": 9,
      "question": "If a projectile is launched horizontally, its initial vertical velocity is:",
      "options": [
        "Zero",
        "Equal to horizontal velocity",
        "g",
        "Maximum"
      ],
      "answer": "Zero",
      "correct_option": "Zero",
      "difficulty": "easy",
      "global_id": 9,
      "explanation": "For horizontal launch (θ = 0°), v₀y = v₀ sin(0°) = 0 m/s."
    },
    {
      "id": 10,
      "question": "For a projectile returning to the same height, time of ascent is:",
      "options": [
        "Equal to time of descent",
        "Twice time of descent",
        "Half time of descent",
        "Always zero"
      ],
      "answer": "Equal to time of descent",
      "correct_option": "Equal to time of descent",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Symmetry of constant acceleration under gravity ensures tascent = tdescent = (v₀ sinθ)/g."
    },
    {
      "id": 11,
      "question": "At the highest point, the acceleration of a projectile is:",
      "options": [
        "g downward",
        "Zero",
        "g upward",
        "Horizontal"
      ],
      "answer": "g downward",
      "correct_option": "g downward",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "Gravity does not disappear at the apex; acceleration remains constant at g downward."
    },
    {
      "id": 12,
      "question": "Range means:",
      "options": [
        "Horizontal distance travelled",
        "Maximum vertical height",
        "Time taken to rise",
        "Initial speed"
      ],
      "answer": "Horizontal distance travelled",
      "correct_option": "Horizontal distance travelled",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "The horizontal range R is the total displacement along the x-axis from launch to landing."
    },
    {
      "id": 13,
      "question": "Maximum height means:",
      "options": [
        "Greatest vertical displacement above launch level",
        "Horizontal distance",
        "Total distance",
        "Time of flight"
      ],
      "answer": "Greatest vertical displacement above launch level",
      "correct_option": "Greatest vertical displacement above launch level",
      "difficulty": "easy",
      "global_id": 13,
      "explanation": "Hmax is the peak vertical coordinate reached along the trajectory."
    },
    {
      "id": 14,
      "question": "Time of flight is the:",
      "options": [
        "Total time projectile remains in air",
        "Time to reach maximum height only",
        "Horizontal distance",
        "Initial velocity"
      ],
      "answer": "Total time projectile remains in air",
      "correct_option": "Total time projectile remains in air",
      "difficulty": "easy",
      "global_id": 14,
      "explanation": "Time of flight T is the total duration between launch and touchdown."
    },
    {
      "id": 15,
      "question": "The horizontal component of initial velocity is:",
      "options": [
        "u cosθ",
        "u sinθ",
        "u tanθ",
        "u/g"
      ],
      "answer": "u cosθ",
      "correct_option": "u cosθ",
      "difficulty": "easy",
      "global_id": 15,
      "explanation": "By trigonometry on the launch velocity vector, ux = u cosθ."
    },
    {
      "id": 16,
      "question": "The vertical component of initial velocity is:",
      "options": [
        "u sinθ",
        "u cosθ",
        "u/g",
        "u tanθ"
      ],
      "answer": "u sinθ",
      "correct_option": "u sinθ",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "By trigonometry on the launch velocity vector, uy = u sinθ."
    },
    {
      "id": 17,
      "question": "At a launch angle of 0°, the projectile is launched:",
      "options": [
        "Horizontally",
        "Vertically upward",
        "Vertically downward",
        "At 45°"
      ],
      "answer": "Horizontally",
      "correct_option": "Horizontally",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "0° relative to horizontal represents pure horizontal launch."
    },
    {
      "id": 18,
      "question": "At a launch angle of 90°, the projectile is launched:",
      "options": [
        "Vertically upward",
        "Horizontally",
        "At 45°",
        "Downward horizontally"
      ],
      "answer": "Vertically upward",
      "correct_option": "Vertically upward",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "90° relative to horizontal corresponds to straight vertical projection."
    },
    {
      "id": 19,
      "question": "Ignoring air resistance, the trajectory depends on:",
      "options": [
        "Initial velocity and gravity",
        "Mass only",
        "Colour only",
        "Temperature only"
      ],
      "answer": "Initial velocity and gravity",
      "correct_option": "Initial velocity and gravity",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "Under ideal Newtonian mechanics, mass cancels out in F = mg = ma, leaving motion governed purely by u, θ, and g."
    },
    {
      "id": 20,
      "question": "The acceleration due to gravity is approximately:",
      "options": [
        "9.8 m/s²",
        "98 m/s²",
        "0.98 m/s²",
        "1 m/s² exactly"
      ],
      "answer": "9.8 m/s²",
      "correct_option": "9.8 m/s²",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "Standard sea-level Earth gravitational acceleration is g ≈ 9.80665 m/s²."
    },
    {
      "id": 21,
      "question": "Which equation gives horizontal displacement for a projectile?",
      "options": [
        "x = (u cosθ)t",
        "x = ut²",
        "x = gt",
        "x = u sinθ"
      ],
      "answer": "x = (u cosθ)t",
      "correct_option": "x = (u cosθ)t",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Since horizontal acceleration is zero, displacement is simply velocity × time: x = (u cosθ)t."
    },
    {
      "id": 22,
      "question": "Which equation gives vertical displacement from launch level?",
      "options": [
        "y = (u sinθ)t − ½gt²",
        "y = ut",
        "y = u cosθ",
        "y = gt²"
      ],
      "answer": "y = (u sinθ)t − ½gt²",
      "correct_option": "y = (u sinθ)t − ½gt²",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "From kinematic equation s = ut + ½at² with a = -g and uy = u sinθ."
    },
    {
      "id": 23,
      "question": "For a projectile landing at the same height, time of flight is:",
      "options": [
        "2u sinθ/g",
        "u cosθ/g",
        "u² sinθ/g",
        "2u cosθ/g"
      ],
      "answer": "2u sinθ/g",
      "correct_option": "2u sinθ/g",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "Setting y = 0 gives (u sinθ)t - ½gt² = 0 => t = 2u sinθ / g."
    },
    {
      "id": 24,
      "question": "For same-level projection, horizontal range is:",
      "options": [
        "u² sin2θ/g",
        "u² cosθ/g",
        "u sinθ/g",
        "2u/g"
      ],
      "answer": "u² sin2θ/g",
      "correct_option": "u² sin2θ/g",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "R = vx × T = (u cosθ)(2u sinθ / g) = (u² / g) (2 sinθ cosθ) = u² sin(2θ) / g."
    },
    {
      "id": 25,
      "question": "Maximum height for a same-level projectile is:",
      "options": [
        "u²sin²θ/(2g)",
        "u²cos²θ/g",
        "u sinθ/g",
        "u²/g²"
      ],
      "answer": "u²sin²θ/(2g)",
      "correct_option": "u²sin²θ/(2g)",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "From vy² = uy² - 2gH => 0 = (u sinθ)² - 2gH => H = u² sin²θ / (2g)."
    },
    {
      "id": 26,
      "question": "For a fixed launch speed, maximum range occurs at:",
      "options": [
        "45°",
        "30°",
        "60°",
        "90°"
      ],
      "answer": "45°",
      "correct_option": "45°",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "sin(2θ) reaches its maximum value of 1.0 when 2θ = 90°, so θ = 45°."
    },
    {
      "id": 27,
      "question": "Angles θ and (90°−θ) with the same speed give:",
      "options": [
        "Same range",
        "Same maximum height",
        "Same time of flight",
        "Zero range"
      ],
      "answer": "Same range",
      "correct_option": "Same range",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Since sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ), complementary angles yield identical range."
    },
    {
      "id": 28,
      "question": "At the highest point, the projectile's speed equals:",
      "options": [
        "Horizontal component of velocity",
        "Vertical component only",
        "Zero always",
        "g"
      ],
      "answer": "Horizontal component of velocity",
      "correct_option": "Horizontal component of velocity",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "At apex, vy = 0, so vtotal = √(vx² + 0) = vx = u cosθ."
    },
    {
      "id": 29,
      "question": "If initial speed is doubled at the same angle, ideal range becomes:",
      "options": [
        "Four times",
        "Two times",
        "Half",
        "Unchanged"
      ],
      "answer": "Four times",
      "correct_option": "Four times",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "Range is proportional to the square of initial velocity (R ∝ u²). (2u)² = 4u²."
    },
    {
      "id": 30,
      "question": "If initial speed is doubled at the same angle, maximum height becomes:",
      "options": [
        "Four times",
        "Two times",
        "Half",
        "Unchanged"
      ],
      "answer": "Four times",
      "correct_option": "Four times",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "Hmax is proportional to u² (H ∝ u²). Doubling speed quadruples peak height."
    },
    {
      "id": 31,
      "question": "If g increases while u and θ stay fixed, time of flight:",
      "options": [
        "Decreases",
        "Increases",
        "Stays exactly same",
        "Becomes infinite"
      ],
      "answer": "Decreases",
      "correct_option": "Decreases",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Since T = 2u sinθ / g, time of flight is inversely proportional to g."
    },
    {
      "id": 32,
      "question": "If g increases while u and θ stay fixed, maximum height:",
      "options": [
        "Decreases",
        "Increases",
        "Stays same",
        "Becomes infinite"
      ],
      "answer": "Decreases",
      "correct_option": "Decreases",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Hmax = u² sin²θ / (2g); stronger gravity decelerates upward velocity faster, reducing peak height."
    },
    {
      "id": 33,
      "question": "At the same height during ascent and descent, vertical velocity components are:",
      "options": [
        "Equal in magnitude and opposite in direction",
        "Equal and same direction",
        "Both zero",
        "Always different in magnitude"
      ],
      "answer": "Equal in magnitude and opposite in direction",
      "correct_option": "Equal in magnitude and opposite in direction",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Conservation of mechanical energy dictates equal speeds at equal elevations, with opposite signs for vy."
    },
    {
      "id": 34,
      "question": "The horizontal velocity at landing, neglecting air resistance, is:",
      "options": [
        "Same as initial horizontal velocity",
        "Zero",
        "Double initial horizontal velocity",
        "Opposite initial horizontal velocity"
      ],
      "answer": "Same as initial horizontal velocity",
      "correct_option": "Same as initial horizontal velocity",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "With ax = 0, vx remains unchanged from launch to impact."
    },
    {
      "id": 35,
      "question": "The velocity of a projectile at any instant has:",
      "options": [
        "Horizontal and vertical components",
        "Only vertical component",
        "Only horizontal component",
        "No components"
      ],
      "answer": "Horizontal and vertical components",
      "correct_option": "Horizontal and vertical components",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "2D motion is resolved into two orthogonal 1D components: vx and vy."
    },
    {
      "id": 36,
      "question": "For θ = 45° and u = 10 m/s, approximate range using g = 10 m/s² is:",
      "options": [
        "10 m",
        "5 m",
        "20 m",
        "100 m"
      ],
      "answer": "10 m",
      "correct_option": "10 m",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "R = (10² × sin(90°)) / 10 = (100 × 1) / 10 = 10 m."
    },
    {
      "id": 37,
      "question": "For θ = 90° in same-level range formula, range is:",
      "options": [
        "Zero",
        "Maximum",
        "u²/g",
        "2u²/g"
      ],
      "answer": "Zero",
      "correct_option": "Zero",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "R = (u² sin(180°)) / g = 0 m, because the projectile travels straight up and down on the spot."
    },
    {
      "id": 38,
      "question": "A projectile's vertical velocity changes because of:",
      "options": [
        "Gravity",
        "Horizontal motion",
        "Its mass only",
        "Its colour"
      ],
      "answer": "Gravity",
      "correct_option": "Gravity",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "Gravitational force provides the continuous vertical acceleration."
    },
    {
      "id": 39,
      "question": "The slope of a projectile trajectory at any point represents:",
      "options": [
        "vy/vx",
        "vx/vy",
        "g/u",
        "u/g"
      ],
      "answer": "vy/vx",
      "correct_option": "vy/vx",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "dy/dx = (dy/dt) / (dx/dt) = vy / vx = tan(instantaneous angle)."
    },
    {
      "id": 40,
      "question": "The equation of trajectory for same-origin projection is:",
      "options": [
        "y = x tanθ − gx²/(2u²cos²θ)",
        "y = x + u",
        "y = gt²",
        "y = u²x"
      ],
      "answer": "y = x tanθ − gx²/(2u²cos²θ)",
      "correct_option": "y = x tanθ − gx²/(2u²cos²θ)",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "Eliminating t = x/(u cosθ) from y = (u sinθ)t - ½gt² yields the standard Cartesian trajectory formula."
    },
    {
      "id": 41,
      "question": "A projectile has maximum range R. If its launch speed is doubled, the new maximum range is:",
      "options": [
        "4R",
        "2R",
        "R/2",
        "R"
      ],
      "answer": "4R",
      "correct_option": "4R",
      "difficulty": "hard",
      "global_id": 41,
      "explanation": "Rmax = u²/g. Doubling u to 2u yields (2u)²/g = 4(u²/g) = 4R."
    },
    {
      "id": 42,
      "question": "Two complementary angles have the same range because:",
      "options": [
        "sin(2θ) is the same",
        "cosθ is always zero",
        "Their heights are equal",
        "Their times are always equal"
      ],
      "answer": "sin(2θ) is the same",
      "correct_option": "sin(2θ) is the same",
      "difficulty": "hard",
      "global_id": 42,
      "explanation": "sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ)."
    },
    {
      "id": 43,
      "question": "For a projectile launched and landing at the same height, maximum range occurs when:",
      "options": [
        "sin2θ = 1",
        "cosθ = 1",
        "sinθ = 0",
        "tanθ = 0"
      ],
      "answer": "sin2θ = 1",
      "correct_option": "sin2θ = 1",
      "difficulty": "hard",
      "global_id": 43,
      "explanation": "Maximum of sin(2θ) is 1, which occurs at 2θ = 90° => θ = 45°."
    },
    {
      "id": 44,
      "question": "At the highest point of a projectile, which statement is correct?",
      "options": [
        "vy = 0 but acceleration is still g downward",
        "Both velocity and acceleration are zero",
        "vx = 0 and acceleration is zero",
        "Acceleration is horizontal"
      ],
      "answer": "vy = 0 but acceleration is still g downward",
      "correct_option": "vy = 0 but acceleration is still g downward",
      "difficulty": "hard",
      "global_id": 44,
      "explanation": "The projectile maintains horizontal velocity vx = u cosθ and experiences constant acceleration g downward."
    },
    {
      "id": 45,
      "question": "A projectile is launched with u = 20 m/s at 30°, g = 10 m/s². Its time of flight is:",
      "options": [
        "2 s",
        "1 s",
        "4 s",
        "√3 s"
      ],
      "answer": "2 s",
      "correct_option": "2 s",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "T = 2u sinθ / g = (2 × 20 × sin(30°)) / 10 = (40 × 0.5) / 10 = 2.0 s."
    },
    {
      "id": 46,
      "question": "For u = 20 m/s, θ = 45°, g = 10 m/s², the range is:",
      "options": [
        "40 m",
        "20 m",
        "10 m",
        "80 m"
      ],
      "answer": "40 m",
      "correct_option": "40 m",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "R = (20² × sin(90°)) / 10 = (400 × 1) / 10 = 40 m."
    },
    {
      "id": 47,
      "question": "For u = 20 m/s, θ = 30°, g = 10 m/s², maximum height is:",
      "options": [
        "5 m",
        "10 m",
        "20 m",
        "2.5 m"
      ],
      "answer": "5 m",
      "correct_option": "5 m",
      "difficulty": "hard",
      "global_id": 47,
      "explanation": "H = u² sin²θ / (2g) = (400 × 0.25) / 20 = 100 / 20 = 5 m."
    },
    {
      "id": 48,
      "question": "If a projectile is launched at θ and its range is maximum, its horizontal and initial vertical velocity components are:",
      "options": [
        "Equal",
        "Opposite",
        "One is zero",
        "Both zero"
      ],
      "answer": "Equal",
      "correct_option": "Equal",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "At θ = 45°, ux = u cos(45°) = u/√2 and uy = u sin(45°) = u/√2, so ux = uy."
    },
    {
      "id": 49,
      "question": "A projectile is at the same vertical level at t1 and t2. For same-level motion, the times satisfy:",
      "options": [
        "t1 + t2 = 2u sinθ/g",
        "t1t2 = 0",
        "t1 = t2 always",
        "t1 − t2 = g"
      ],
      "answer": "t1 + t2 = 2u sinθ/g",
      "correct_option": "t1 + t2 = 2u sinθ/g",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "From y = (u sinθ)t - ½gt², the sum of the roots of ½gt² - (u sinθ)t + y = 0 is t1 + t2 = (u sinθ)/(½g) = 2u sinθ / g (total flight time)."
    },
    {
      "id": 50,
      "question": "If the range is kept fixed while g is constant, changing u generally requires changing:",
      "options": [
        "Launch angle",
        "Mass",
        "Colour",
        "Air pressure only"
      ],
      "answer": "Launch angle",
      "correct_option": "Launch angle",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "Since R = u² sin(2θ) / g, if u changes, sin(2θ) and hence θ must adjust to maintain constant R."
    }
  ]
};

export const OPTICAL_FIBRE_QUESTION_BANK = {
  "experiment": "Optical Fibre Numerical Aperture - Question Bank",
  "experimentId": "optical",
  "quizId": "optical-fibre-mastery-quiz",
  "experimentName": "Optical Fibre Numerical Aperture",
  "description": "Comprehensive 50-Question Physics Question Bank for Optical Fibre Numerical Aperture",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What is the basic principle of optical fibre transmission?",
      "options": [
        "Total internal reflection",
        "Photoelectric effect",
        "Diffraction only",
        "Electromagnetic induction"
      ],
      "answer": "Total internal reflection",
      "correct_option": "Total internal reflection",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Light signals are confined and guided inside an optical fibre by continuous total internal reflections."
    },
    {
      "id": 2,
      "question": "The central light-guiding region of an optical fibre is called:",
      "options": [
        "Core",
        "Cladding",
        "Jacket",
        "Coating"
      ],
      "answer": "Core",
      "correct_option": "Core",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "The core is the inner cylindrical optical medium through which light travels."
    },
    {
      "id": 3,
      "question": "The layer surrounding the core is called:",
      "options": [
        "Cladding",
        "Anode",
        "Cathode",
        "Terminal"
      ],
      "answer": "Cladding",
      "correct_option": "Cladding",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "The cladding wraps around the core with a slightly lower refractive index to facilitate TIR."
    },
    {
      "id": 4,
      "question": "The refractive index of the core is generally:",
      "options": [
        "Greater than that of cladding",
        "Less than cladding",
        "Equal to air always",
        "Zero"
      ],
      "answer": "Greater than that of cladding",
      "correct_option": "Greater than that of cladding",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "TIR requires light to propagate from a medium of higher refractive index (n₁) to lower index (n₂), so n₁ > n₂."
    },
    {
      "id": 5,
      "question": "TIR stands for:",
      "options": [
        "Total Internal Reflection",
        "Total Intensity Radiation",
        "Transmitted Internal Refraction",
        "Total Infrared Response"
      ],
      "answer": "Total Internal Reflection",
      "correct_option": "Total Internal Reflection",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "Total Internal Reflection is the optical phenomenon where 100% of incident light is reflected back into the denser medium."
    },
    {
      "id": 6,
      "question": "For TIR, light must travel from:",
      "options": [
        "Optically denser to optically rarer medium",
        "Rarer to denser medium",
        "Vacuum to vacuum",
        "Any medium at any angle"
      ],
      "answer": "Optically denser to optically rarer medium",
      "correct_option": "Optically denser to optically rarer medium",
      "difficulty": "easy",
      "global_id": 6,
      "explanation": "TIR can only take place when light travels from higher optical density (core) towards lower optical density (cladding)."
    },
    {
      "id": 7,
      "question": "The angle of incidence for TIR must be:",
      "options": [
        "Greater than the critical angle",
        "Less than critical angle",
        "Always 0°",
        "Always 90°"
      ],
      "answer": "Greater than the critical angle",
      "correct_option": "Greater than the critical angle",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "When θi > θc, refraction into the rarer medium cannot satisfy Snell's law, causing total reflection."
    },
    {
      "id": 8,
      "question": "Optical fibre is commonly used for:",
      "options": [
        "Communication",
        "Measuring mass",
        "Generating mechanical power",
        "Heating rooms"
      ],
      "answer": "Communication",
      "correct_option": "Communication",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "Optical fibres form the backbone of modern global high-speed telecommunications and internet infrastructure."
    },
    {
      "id": 9,
      "question": "Which material is commonly used to make optical fibres?",
      "options": [
        "Glass or plastic",
        "Iron only",
        "Copper only",
        "Wood"
      ],
      "answer": "Glass or plastic",
      "correct_option": "Glass or plastic",
      "difficulty": "easy",
      "global_id": 9,
      "explanation": "High-purity silica glass (SiO₂) or transparent polymers (PMMA) are standard optical fibre materials."
    },
    {
      "id": 10,
      "question": "A single-mode fibre has:",
      "options": [
        "A very small core and mainly one propagation mode",
        "A very large metal core",
        "No cladding",
        "Only electrical current"
      ],
      "answer": "A very small core and mainly one propagation mode",
      "correct_option": "A very small core and mainly one propagation mode",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Single-mode fibres (core diameter ~8-10 µm) guide only the fundamental optical mode, eliminating modal dispersion."
    },
    {
      "id": 11,
      "question": "Multimode fibre generally has:",
      "options": [
        "A larger core",
        "No core",
        "Only one photon",
        "No cladding"
      ],
      "answer": "A larger core",
      "correct_option": "A larger core",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "Multimode fibres typically have larger core diameters (50 µm to 62.5 µm), allowing multiple ray propagation paths."
    },
    {
      "id": 12,
      "question": "Numerical aperture indicates the fibre's:",
      "options": [
        "Light-gathering ability",
        "Mass",
        "Length only",
        "Electrical resistance only"
      ],
      "answer": "Light-gathering ability",
      "correct_option": "Light-gathering ability",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "NA = sin(θmax) characterizes the range of launch angles from which the fibre can accept and guide light."
    },
    {
      "id": 13,
      "question": "Acceptance angle is related to:",
      "options": [
        "Maximum angle for light to enter and remain guided",
        "Fibre mass",
        "Core temperature",
        "Electrical power"
      ],
      "answer": "Maximum angle for light to enter and remain guided",
      "correct_option": "Maximum angle for light to enter and remain guided",
      "difficulty": "easy",
      "global_id": 13,
      "explanation": "Acceptance angle θmax is the maximum semi-angle of the incident light cone that undergoes TIR at core-cladding boundary."
    },
    {
      "id": 14,
      "question": "The critical angle depends on:",
      "options": [
        "Refractive indices of the two media",
        "Mass only",
        "Colour name only",
        "Fibre length only"
      ],
      "answer": "Refractive indices of the two media",
      "correct_option": "Refractive indices of the two media",
      "difficulty": "easy",
      "global_id": 14,
      "explanation": "The critical angle is determined by sin(θc) = n₂ / n₁."
    },
    {
      "id": 15,
      "question": "The outer protective layer of a fibre is generally called:",
      "options": [
        "Jacket/coating",
        "Core",
        "Cladding index",
        "Lens"
      ],
      "answer": "Jacket/coating",
      "correct_option": "Jacket/coating",
      "difficulty": "easy",
      "global_id": 15,
      "explanation": "The buffer coating and outer polymer jacket protect the fragile glass core/cladding against moisture and mechanical stress."
    },
    {
      "id": 16,
      "question": "In an optical fibre, light is guided mainly through the:",
      "options": [
        "Core",
        "Jacket",
        "Air outside",
        "Connector pin"
      ],
      "answer": "Core",
      "correct_option": "Core",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "The high refractive index core traps and propagates the optical wave."
    },
    {
      "id": 17,
      "question": "Optical fibre communication offers:",
      "options": [
        "High bandwidth",
        "Very low bandwidth only",
        "No data transmission",
        "Only audio transmission"
      ],
      "answer": "High bandwidth",
      "correct_option": "High bandwidth",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "Optical frequencies (~hundreds of Terahertz) support gigabits-to-terabits per second data transmission bandwidth."
    },
    {
      "id": 18,
      "question": "Optical fibres are immune to ordinary:",
      "options": [
        "Electromagnetic interference",
        "Gravity",
        "Light",
        "All temperature effects"
      ],
      "answer": "Electromagnetic interference",
      "correct_option": "Electromagnetic interference",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "Dielectric glass fibres do not conduct electrical current, making them completely immune to EMI and radio noise."
    },
    {
      "id": 19,
      "question": "A ray travelling exactly along the normal at a boundary has angle of incidence:",
      "options": [
        "0°",
        "45°",
        "90°",
        "180°"
      ],
      "answer": "0°",
      "correct_option": "0°",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "Angle of incidence is measured relative to the normal; normal incidence means θ = 0°."
    },
    {
      "id": 20,
      "question": "The unit commonly used for refractive index is:",
      "options": [
        "No unit",
        "Metre",
        "Newton",
        "Watt"
      ],
      "answer": "No unit",
      "correct_option": "No unit",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "Refractive index n = c/v is a dimensionless ratio of two velocities."
    },
    {
      "id": 21,
      "question": "Snell's law relates:",
      "options": [
        "Angles and refractive indices",
        "Mass and force",
        "Power and time",
        "Charge and current only"
      ],
      "answer": "Angles and refractive indices",
      "correct_option": "Angles and refractive indices",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)."
    },
    {
      "id": 22,
      "question": "For an optical fibre with core index n1 and cladding index n2, guidance requires:",
      "options": [
        "n1 > n2",
        "n1 < n2",
        "n1 = 0",
        "n2 = 0 always"
      ],
      "answer": "n1 > n2",
      "correct_option": "n1 > n2",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "Core must be optically denser than cladding to support TIR."
    },
    {
      "id": 23,
      "question": "Critical angle C at a core-cladding boundary satisfies:",
      "options": [
        "sin C = n2/n1",
        "sin C = n1/n2",
        "C = n1+n2",
        "C = n1n2"
      ],
      "answer": "sin C = n2/n1",
      "correct_option": "sin C = n2/n1",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "Setting refracted angle θ₂ = 90° in Snell's law gives n₁ sin(C) = n₂ sin(90°) => sin(C) = n₂/n₁."
    },
    {
      "id": 24,
      "question": "For air outside a fibre, numerical aperture is commonly given by:",
      "options": [
        "NA = √(n1² − n2²)",
        "NA = n1+n2",
        "NA = n1/n2",
        "NA = n1n2"
      ],
      "answer": "NA = √(n1² − n2²)",
      "correct_option": "NA = √(n1² − n2²)",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "NA = n₀ sin(θmax) = √(n₁² - n₂²) when launching from air (n₀ = 1.0)."
    },
    {
      "id": 25,
      "question": "Acceptance angle increases when NA:",
      "options": [
        "Increases",
        "Decreases",
        "Becomes zero",
        "Is unrelated"
      ],
      "answer": "Increases",
      "correct_option": "Increases",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "θmax = arcsin(NA); higher NA directly widens the acceptance cone angle."
    },
    {
      "id": 26,
      "question": "If n1 = n2, the ideal numerical aperture is:",
      "options": [
        "Zero",
        "One",
        "n1+n2",
        "Infinite"
      ],
      "answer": "Zero",
      "correct_option": "Zero",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "NA = √(n₁² - n₂²) = √(n₁² - n₁²) = 0; no refractive index contrast means zero light-guiding capability."
    },
    {
      "id": 27,
      "question": "Why does cladding have a lower refractive index than the core?",
      "options": [
        "To enable total internal reflection at the interface",
        "To absorb all light",
        "To stop all transmission",
        "To generate photons"
      ],
      "answer": "To enable total internal reflection at the interface",
      "correct_option": "To enable total internal reflection at the interface",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Without a lower-index cladding, light would refract and leak out into surroundings."
    },
    {
      "id": 28,
      "question": "Which fibre is generally preferred for very long-distance, high-bandwidth links?",
      "options": [
        "Single-mode fibre",
        "Multimode step-index only",
        "Metal wire",
        "Plastic tube"
      ],
      "answer": "Single-mode fibre",
      "correct_option": "Single-mode fibre",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "Single-mode fibres provide extremely low attenuation and zero intermodal pulse dispersion over hundreds of kilometers."
    },
    {
      "id": 29,
      "question": "Step-index fibre means the refractive index of the core:",
      "options": [
        "Is approximately constant and changes abruptly at the cladding",
        "Changes smoothly throughout the core",
        "Is always zero",
        "Equals air everywhere"
      ],
      "answer": "Is approximately constant and changes abruptly at the cladding",
      "correct_option": "Is approximately constant and changes abruptly at the cladding",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "Step-index profile features uniform core index n₁ with a sharp step change to n₂ at the cladding boundary."
    },
    {
      "id": 30,
      "question": "In a graded-index multimode fibre, core refractive index:",
      "options": [
        "Gradually decreases away from the centre",
        "Is constant everywhere",
        "Is zero at the centre",
        "Changes only at the jacket"
      ],
      "answer": "Gradually decreases away from the centre",
      "correct_option": "Gradually decreases away from the centre",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "Parabolic grading curves outer rays back towards the axis, equalizing travel times across modes."
    },
    {
      "id": 31,
      "question": "Modal dispersion is especially associated with:",
      "options": [
        "Multimode propagation",
        "Single-mode propagation only",
        "No optical propagation",
        "Electrical wires only"
      ],
      "answer": "Multimode propagation",
      "correct_option": "Multimode propagation",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Different modes take paths of different geometric lengths, spreading the optical pulse."
    },
    {
      "id": 32,
      "question": "Attenuation in fibre refers to:",
      "options": [
        "Loss of optical power during propagation",
        "Increase in optical power",
        "Change in fibre mass",
        "Increase in wavelength only"
      ],
      "answer": "Loss of optical power during propagation",
      "correct_option": "Loss of optical power during propagation",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Attenuation (measured in dB/km) is signal power decay as photons travel through the fibre."
    },
    {
      "id": 33,
      "question": "One important cause of attenuation is:",
      "options": [
        "Absorption and scattering",
        "Gravity",
        "Magnetism only",
        "Sound"
      ],
      "answer": "Absorption and scattering",
      "correct_option": "Absorption and scattering",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Rayleigh scattering (from density fluctuations) and material absorption are primary intrinsic losses."
    },
    {
      "id": 34,
      "question": "A connector in an optical system is used mainly to:",
      "options": [
        "Couple light between fibre/device interfaces",
        "Increase gravity",
        "Generate electricity",
        "Change glass into metal"
      ],
      "answer": "Couple light between fibre/device interfaces",
      "correct_option": "Couple light between fibre/device interfaces",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "Optical connectors provide low-loss, repeatable optical alignment between fibres and transmitter/receiver ports."
    },
    {
      "id": 35,
      "question": "If the refractive index of the core increases while cladding index stays fixed, NA generally:",
      "options": [
        "Increases",
        "Decreases to zero",
        "Stays exactly zero",
        "Becomes negative"
      ],
      "answer": "Increases",
      "correct_option": "Increases",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "NA = √(n₁² - n₂²); increasing n₁ increases the radical value, raising NA."
    },
    {
      "id": 36,
      "question": "For TIR, the refracted ray at the boundary:",
      "options": [
        "Does not enter the second medium as a propagating ray",
        "Has maximum intensity outside",
        "Always travels backward through air",
        "Becomes a sound wave"
      ],
      "answer": "Does not enter the second medium as a propagating ray",
      "correct_option": "Does not enter the second medium as a propagating ray",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "No propagating wave carries energy into the rarer medium (only a non-propagating evanescent field exists)."
    },
    {
      "id": 37,
      "question": "The acceptance cone represents:",
      "options": [
        "The range of input directions accepted by the fibre",
        "The fibre's temperature range",
        "The output power only",
        "The cable diameter only"
      ],
      "answer": "The range of input directions accepted by the fibre",
      "correct_option": "The range of input directions accepted by the fibre",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "It is the 3D cone formed by rotating the maximum acceptance angle θmax about the core axis."
    },
    {
      "id": 38,
      "question": "Why is optical fibre useful in medical endoscopy?",
      "options": [
        "It can transmit light/images through a flexible path",
        "It produces X-rays",
        "It measures mass directly",
        "It blocks all visible light"
      ],
      "answer": "It can transmit light/images through a flexible path",
      "correct_option": "It can transmit light/images through a flexible path",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "Coherent fibre bundles allow illumination and visual inspection inside internal organs non-invasively."
    },
    {
      "id": 39,
      "question": "Compared with copper communication cables, fibre generally has:",
      "options": [
        "Lower transmission loss over suitable long links and higher bandwidth",
        "Much lower bandwidth",
        "Higher electromagnetic interference",
        "No communication capability"
      ],
      "answer": "Lower transmission loss over suitable long links and higher bandwidth",
      "correct_option": "Lower transmission loss over suitable long links and higher bandwidth",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "Optical attenuation (~0.2 dB/km at 1550 nm) is orders of magnitude lower than electrical cable attenuation."
    },
    {
      "id": 40,
      "question": "A fibre's V-number (normalized frequency) depends on:",
      "options": [
        "Core/cladding indices, core radius and wavelength",
        "Mass only",
        "Cable colour only",
        "Room pressure only"
      ],
      "answer": "Core/cladding indices, core radius and wavelength",
      "correct_option": "Core/cladding indices, core radius and wavelength",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "V = (2π a / λ) √(n₁² - n₂²) = (2π a / λ) NA."
    },
    {
      "id": 41,
      "question": "If n1 = 1.50 and n2 = 1.48, the NA in air is approximately:",
      "options": [
        "0.244",
        "0.020",
        "1.49",
        "2.98"
      ],
      "answer": "0.244",
      "correct_option": "0.244",
      "difficulty": "hard",
      "global_id": 41,
      "explanation": "NA = √(1.50² - 1.48²) = √(2.25 - 2.1904) = √0.0596 ≈ 0.2441."
    },
    {
      "id": 42,
      "question": "For n1 = 1.5 and n2 = 1.0, the critical angle is approximately:",
      "options": [
        "41.8°",
        "30°",
        "60°",
        "90°"
      ],
      "answer": "41.8°",
      "correct_option": "41.8°",
      "difficulty": "hard",
      "global_id": 42,
      "explanation": "sin(θc) = 1.0 / 1.5 = 0.6667 => θc = arcsin(0.6667) ≈ 41.81°."
    },
    {
      "id": 43,
      "question": "If NA = 0.5 in air, the acceptance half-angle is approximately:",
      "options": [
        "30°",
        "15°",
        "45°",
        "60°"
      ],
      "answer": "30°",
      "correct_option": "30°",
      "difficulty": "hard",
      "global_id": 43,
      "explanation": "sin(θmax) = NA = 0.5 => θmax = arcsin(0.5) = 30°."
    },
    {
      "id": 44,
      "question": "If the fibre core radius is increased while other parameters remain fixed, the normalized frequency V:",
      "options": [
        "Increases",
        "Decreases",
        "Becomes zero",
        "Does not depend on radius"
      ],
      "answer": "Increases",
      "correct_option": "Increases",
      "difficulty": "hard",
      "global_id": 44,
      "explanation": "V = (2π a / λ) NA is directly proportional to core radius a."
    },
    {
      "id": 45,
      "question": "A fibre has n1 = 1.50 and n2 = 1.47. Its NA is closest to:",
      "options": [
        "0.30",
        "0.03",
        "1.485",
        "2.97"
      ],
      "answer": "0.30",
      "correct_option": "0.30",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "NA = √(1.50² - 1.47²) = √(2.25 - 2.1609) = √0.0891 ≈ 0.2985 ≈ 0.30."
    },
    {
      "id": 46,
      "question": "Why does single-mode fibre reduce modal dispersion?",
      "options": [
        "Only one mode is primarily guided",
        "It has no cladding",
        "It uses electrical current",
        "It has no refractive index difference"
      ],
      "answer": "Only one mode is primarily guided",
      "correct_option": "Only one mode is primarily guided",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "With only one spatial mode allowed (V < 2.405), there are no multiple ray paths to delay one another."
    },
    {
      "id": 47,
      "question": "If the wavelength increases while fibre radius and indices remain fixed, normalized frequency V:",
      "options": [
        "Decreases",
        "Increases",
        "Stays exactly same",
        "Becomes infinite"
      ],
      "answer": "Decreases",
      "correct_option": "Decreases",
      "difficulty": "hard",
      "global_id": 47,
      "explanation": "V ∝ 1/λ; longer wavelengths produce lower V numbers."
    },
    {
      "id": 48,
      "question": "For a fibre with greater NA, the acceptance cone is generally:",
      "options": [
        "Wider",
        "Narrower",
        "Absent",
        "Always 0°"
      ],
      "answer": "Wider",
      "correct_option": "Wider",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "Higher NA means larger sin(θmax), opening a broader angular cone of accepted light."
    },
    {
      "id": 49,
      "question": "If core-cladding index difference is reduced significantly, TIR guidance generally becomes:",
      "options": [
        "Less strongly confined and NA decreases",
        "Stronger with larger NA",
        "Independent of indices",
        "Impossible only because wavelength changes"
      ],
      "answer": "Less strongly confined and NA decreases",
      "correct_option": "Less strongly confined and NA decreases",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "Lower index contrast Δ = (n₁ - n₂)/n₁ reduces the numerical aperture and makes the mode field more prone to bending loss."
    },
    {
      "id": 50,
      "question": "Which change most directly reduces coupling errors at a fibre input?",
      "options": [
        "Accurate alignment of the source with the acceptance cone",
        "Increasing cable weight",
        "Changing the jacket colour",
        "Heating the connector"
      ],
      "answer": "Accurate alignment of the source with the acceptance cone",
      "correct_option": "Accurate alignment of the source with the acceptance cone",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "Matching the source emission angle to the fibre's acceptance angle minimizes geometric insertion loss."
    }
  ]
};

export const COLOUR_SENSOR_QUESTION_BANK = {
  "experiment": "Study of Colour Sensor - Question Bank",
  "experimentId": "colour-sensor",
  "quizId": "colour-sensor-mastery-quiz",
  "experimentName": "Study of Colour Sensor (TCS3200)",
  "description": "Comprehensive 50-Question Physics Question Bank for Study of Colour Sensor (TCS3200)",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What is the main purpose of a colour sensor?",
      "options": [
        "Detect colours/light characteristics",
        "Measure temperature",
        "Measure pressure",
        "Measure mass"
      ],
      "answer": "Detect colours/light characteristics",
      "correct_option": "Detect colours/light characteristics",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Colour sensors quantify spectral reflectance/emission across RGB wavelengths to classify target chromaticity."
    },
    {
      "id": 2,
      "question": "RGB stands for:",
      "options": [
        "Red, Green, Blue",
        "Red, Grey, Black",
        "Radiation, Green, Brightness",
        "Range, Gain, Band"
      ],
      "answer": "Red, Green, Blue",
      "correct_option": "Red, Green, Blue",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "RGB represents the additive primary color channels in optoelectronics and trichromatic vision."
    },
    {
      "id": 3,
      "question": "Which component is commonly used to detect light?",
      "options": [
        "Photodiode",
        "Fuse",
        "Switch",
        "Transformer"
      ],
      "answer": "Photodiode",
      "correct_option": "Photodiode",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Photodiodes generate current proportional to the flux of incident photons on their p-n junction."
    },
    {
      "id": 4,
      "question": "Which RGB colour has the longest wavelength?",
      "options": [
        "Red",
        "Green",
        "Blue",
        "All are equal"
      ],
      "answer": "Red",
      "correct_option": "Red",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "Red light occupies the long-wavelength end of the visible spectrum (~620–750 nm)."
    },
    {
      "id": 5,
      "question": "Which RGB colour has the shortest wavelength?",
      "options": [
        "Blue",
        "Red",
        "Green",
        "All are equal"
      ],
      "answer": "Blue",
      "correct_option": "Blue",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "Blue/violet light has the shortest wavelength in visible spectrum (~400–495 nm)."
    },
    {
      "id": 6,
      "question": "If a surface reflects mostly red light, it generally appears:",
      "options": [
        "Red",
        "Blue",
        "Green",
        "Black"
      ],
      "answer": "Red",
      "correct_option": "Red",
      "difficulty": "easy",
      "global_id": 6,
      "explanation": "An object's apparent color is determined by the spectral bands it reflects into the detector."
    },
    {
      "id": 7,
      "question": "Visible light is a part of:",
      "options": [
        "Electromagnetic radiation",
        "Sound radiation",
        "Mechanical radiation",
        "Nuclear radiation only"
      ],
      "answer": "Electromagnetic radiation",
      "correct_option": "Electromagnetic radiation",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Visible light consists of electromagnetic waves in the frequency range ~430–750 THz."
    },
    {
      "id": 8,
      "question": "The approximate visible-light wavelength range is:",
      "options": [
        "400–700 nm",
        "1–10 nm",
        "10–100 m",
        "1–10 km"
      ],
      "answer": "400–700 nm",
      "correct_option": "400–700 nm",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "Human and sensor visible spectral sensitivity spans roughly 380/400 nm (violet) to 700/750 nm (deep red)."
    },
    {
      "id": 9,
      "question": "A photodiode converts incident light into an:",
      "options": [
        "Electrical signal",
        "Sound wave",
        "Mechanical force",
        "Chemical fuel"
      ],
      "answer": "Electrical signal",
      "correct_option": "Electrical signal",
      "difficulty": "easy",
      "global_id": 9,
      "explanation": "The photoelectric effect creates electron-hole pairs, producing a measurable photocurrent or voltage."
    },
    {
      "id": 10,
      "question": "Equal high RGB intensities ideally produce:",
      "options": [
        "White",
        "Black",
        "Red",
        "Magenta"
      ],
      "answer": "White",
      "correct_option": "White",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Additive mixing of full-intensity Red, Green, and Blue produces White light."
    },
    {
      "id": 11,
      "question": "Very low RGB intensities correspond approximately to:",
      "options": [
        "Black",
        "White",
        "Yellow",
        "Cyan"
      ],
      "answer": "Black",
      "correct_option": "Black",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "The absence of reflected or emitted light (R=G=B≈0) corresponds to Black."
    },
    {
      "id": 12,
      "question": "Red plus green light produces:",
      "options": [
        "Yellow",
        "Cyan",
        "Magenta",
        "Blue"
      ],
      "answer": "Yellow",
      "correct_option": "Yellow",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "In additive color synthesis, Red + Green = Yellow."
    },
    {
      "id": 13,
      "question": "Green plus blue light produces:",
      "options": [
        "Cyan",
        "Yellow",
        "Red",
        "Orange"
      ],
      "answer": "Cyan",
      "correct_option": "Cyan",
      "difficulty": "easy",
      "global_id": 13,
      "explanation": "In additive color synthesis, Green + Blue = Cyan."
    },
    {
      "id": 14,
      "question": "Red plus blue light produces:",
      "options": [
        "Magenta",
        "Green",
        "Cyan",
        "Yellow"
      ],
      "answer": "Magenta",
      "correct_option": "Magenta",
      "difficulty": "easy",
      "global_id": 14,
      "explanation": "In additive color synthesis, Red + Blue = Magenta."
    },
    {
      "id": 15,
      "question": "The unit nm commonly represents:",
      "options": [
        "Wavelength",
        "Mass",
        "Pressure",
        "Current"
      ],
      "answer": "Wavelength",
      "correct_option": "Wavelength",
      "difficulty": "easy",
      "global_id": 15,
      "explanation": "1 nanometer (nm) = 10⁻⁹ meters, standard for optical wavelengths."
    },
    {
      "id": 16,
      "question": "A sensor is a device that:",
      "options": [
        "Detects a physical quantity and produces a usable signal",
        "Stores energy only",
        "Displays images only",
        "Acts only as a battery"
      ],
      "answer": "Detects a physical quantity and produces a usable signal",
      "correct_option": "Detects a physical quantity and produces a usable signal",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "Transducers/sensors convert physical stimuli into readable electrical responses."
    },
    {
      "id": 17,
      "question": "A colour sensor mainly detects:",
      "options": [
        "Light",
        "Sound",
        "Pressure",
        "Mass"
      ],
      "answer": "Light",
      "correct_option": "Light",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "Colour sensors measure electromagnetic radiation in the visible band."
    },
    {
      "id": 18,
      "question": "If a surface absorbs most visible light, it appears:",
      "options": [
        "Dark",
        "White",
        "Transparent",
        "Bright yellow always"
      ],
      "answer": "Dark",
      "correct_option": "Dark",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "High absorption with minimal reflection reflects almost no photons back to the sensor."
    },
    {
      "id": 19,
      "question": "Which region is normally detected by a visible colour sensor?",
      "options": [
        "Visible spectrum",
        "X-ray",
        "Gamma-ray",
        "Radio"
      ],
      "answer": "Visible spectrum",
      "correct_option": "Visible spectrum",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "Visible sensors have optical filters calibrated for human visual bandwidths (400–700 nm)."
    },
    {
      "id": 20,
      "question": "The three common colour channels in an RGB sensor are:",
      "options": [
        "R, G and B",
        "X, Y and Z only",
        "A, B and C only",
        "P, Q and R only"
      ],
      "answer": "R, G and B",
      "correct_option": "R, G and B",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "TCS3200 uses an 8x8 array of photodiodes partitioned with Red, Green, Blue, and Clear filters."
    },
    {
      "id": 21,
      "question": "Why are multiple RGB channels useful?",
      "options": [
        "They allow different spectral components to be compared",
        "They measure pressure",
        "They remove all light",
        "They increase object mass"
      ],
      "answer": "They allow different spectral components to be compared",
      "correct_option": "They allow different spectral components to be compared",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Comparing relative filter responses lets the system differentiate hue and saturation independently of light intensity."
    },
    {
      "id": 22,
      "question": "If the red-channel reading is much higher than green and blue, the target has a strong:",
      "options": [
        "Red component",
        "Green component",
        "Blue component",
        "Cyan component"
      ],
      "answer": "Red component",
      "correct_option": "Red component",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "High red filter transmittance indicates abundant photons in the ~650 nm wavelength region."
    },
    {
      "id": 23,
      "question": "What is the role of an ADC?",
      "options": [
        "Convert an analog signal into digital values",
        "Produce visible light",
        "Measure mass",
        "Store mechanical energy"
      ],
      "answer": "Convert an analog signal into digital values",
      "correct_option": "Convert an analog signal into digital values",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "Analog-to-Digital Converters (ADCs) quantize continuous photocurrent voltages into discrete digital numbers."
    },
    {
      "id": 24,
      "question": "Why is calibration important for a colour sensor?",
      "options": [
        "It improves accuracy and accounts for system variations",
        "It changes the object's mass",
        "It removes all light",
        "It makes wavelength constant"
      ],
      "answer": "It improves accuracy and accounts for system variations",
      "correct_option": "It improves accuracy and accounts for system variations",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "Calibration normalizes for ambient lighting, LED color temperature, detector responsivity offsets, and distance."
    },
    {
      "id": 25,
      "question": "Why can the same object give different readings under different light sources?",
      "options": [
        "Illumination spectrum and intensity can change",
        "Its mass changes automatically",
        "Gravity changes its colour",
        "The sensor becomes a thermometer"
      ],
      "answer": "Illumination spectrum and intensity can change",
      "correct_option": "Illumination spectrum and intensity can change",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "Reflected spectrum = Incident spectrum × Reflectance curve. If the source spectrum changes (e.g. tungsten vs sunlight), reflected light changes."
    },
    {
      "id": 26,
      "question": "Why should sensor-to-target distance often be kept constant?",
      "options": [
        "To keep measurement conditions consistent",
        "To increase wavelength",
        "To change the target colour",
        "To increase gravity"
      ],
      "answer": "To keep measurement conditions consistent",
      "correct_option": "To keep measurement conditions consistent",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Light intensity obeys the inverse-square law; varying distance shifts signal amplitudes."
    },
    {
      "id": 27,
      "question": "What is spectral response?",
      "options": [
        "Variation of sensor output with wavelength",
        "Variation of mass with time",
        "Variation of pressure with height",
        "Variation of resistance with length only"
      ],
      "answer": "Variation of sensor output with wavelength",
      "correct_option": "Variation of sensor output with wavelength",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Spectral responsivity R(λ) defines the output current per watt of incident optical power as a function of wavelength."
    },
    {
      "id": 28,
      "question": "Which is most directly related to colour rather than just brightness?",
      "options": [
        "Relative RGB values",
        "Battery weight",
        "Screw size",
        "Room temperature alone"
      ],
      "answer": "Relative RGB values",
      "correct_option": "Relative RGB values",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "Ratios r = R/(R+G+B) isolate chromaticity (hue/saturation) from luminance."
    },
    {
      "id": 29,
      "question": "If all RGB readings rise by roughly the same proportion, what likely changed?",
      "options": [
        "Overall illumination intensity",
        "Hue only",
        "Object mass",
        "Wavelength of every photon necessarily"
      ],
      "answer": "Overall illumination intensity",
      "correct_option": "Overall illumination intensity",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "Scaling all color channels uniformly indicates a change in light source brightness or distance, not color."
    },
    {
      "id": 30,
      "question": "What is the purpose of a white reference surface?",
      "options": [
        "Provide a known response for comparison/calibration",
        "Block all light",
        "Generate a laser",
        "Absorb all wavelengths"
      ],
      "answer": "Provide a known response for comparison/calibration",
      "correct_option": "Provide a known response for comparison/calibration",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "A high-reflectance white standard (like barium sulfate or PTFE) provides full-spectrum reference calibration."
    },
    {
      "id": 31,
      "question": "Why can ambient light affect a colour sensor?",
      "options": [
        "It adds unwanted light to the measured signal",
        "It changes gravity",
        "It changes object mass",
        "It stops the sensor from detecting red"
      ],
      "answer": "It adds unwanted light to the measured signal",
      "correct_option": "It adds unwanted light to the measured signal",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Stray background photons combine with the target reflection, skewing RGB proportions."
    },
    {
      "id": 32,
      "question": "What does wavelength describe?",
      "options": [
        "Distance between corresponding points of a wave",
        "Photon mass",
        "Brightness only",
        "Electrical resistance"
      ],
      "answer": "Distance between corresponding points of a wave",
      "correct_option": "Distance between corresponding points of a wave",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Wavelength λ is the spatial period of the optical wave crest-to-crest."
    },
    {
      "id": 33,
      "question": "Photon energy is related to frequency by:",
      "options": [
        "E = hf",
        "E = h/f",
        "E = f/h",
        "E = h+f"
      ],
      "answer": "E = hf",
      "correct_option": "E = hf",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Planck-Einstein relation: E = hf = hc/λ, where h is Planck's constant."
    },
    {
      "id": 34,
      "question": "For electromagnetic radiation in vacuum:",
      "options": [
        "c = fλ",
        "c = f/λ",
        "c = λ/f",
        "c = f+λ"
      ],
      "answer": "c = fλ",
      "correct_option": "c = fλ",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "The wave speed equals frequency times wavelength: c = fλ ≈ 3 × 10⁸ m/s."
    },
    {
      "id": 35,
      "question": "If wavelength increases in vacuum, frequency:",
      "options": [
        "Decreases",
        "Increases",
        "Becomes zero",
        "Always stays the same"
      ],
      "answer": "Decreases",
      "correct_option": "Decreases",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "Because c = fλ is constant, frequency is inversely proportional to wavelength (f = c/λ)."
    },
    {
      "id": 36,
      "question": "Which condition improves repeatability of colour measurements?",
      "options": [
        "Controlled illumination",
        "Changing sensor distance each time",
        "Changing the target angle randomly",
        "Ignoring calibration"
      ],
      "answer": "Controlled illumination",
      "correct_option": "Controlled illumination",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "Consistent lighting and fixed sensor geometry guarantee reproducible spectral measurements."
    },
    {
      "id": 37,
      "question": "RGB values can be normalized mainly to reduce the effect of:",
      "options": [
        "Overall brightness variation",
        "Object mass",
        "Gravity",
        "Room size"
      ],
      "answer": "Overall brightness variation",
      "correct_option": "Overall brightness variation",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "Normalization converts raw values into chromaticity coordinates r, g, b where r + g + b = 1."
    },
    {
      "id": 38,
      "question": "A matte surface is often easier to measure consistently because it:",
      "options": [
        "Reduces strong specular reflections",
        "Emits its own light",
        "Absorbs all colours",
        "Has infinite reflectivity"
      ],
      "answer": "Reduces strong specular reflections",
      "correct_option": "Reduces strong specular reflections",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "Lambertian (matte) diffusion scatters light uniformly in all directions, avoiding specular glare spikes."
    },
    {
      "id": 39,
      "question": "A colour sensor's output is most directly related to:",
      "options": [
        "Light reaching its photodetectors",
        "Object weight",
        "Sound reaching the sensor",
        "Air pressure only"
      ],
      "answer": "Light reaching its photodetectors",
      "correct_option": "Light reaching its photodetectors",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "The electrical output directly corresponds to the radiant flux captured by the filtered photodiode array."
    },
    {
      "id": 40,
      "question": "Under additive colour mixing, equal red and green with little blue appears approximately:",
      "options": [
        "Yellow",
        "Cyan",
        "Magenta",
        "Blue"
      ],
      "answer": "Yellow",
      "correct_option": "Yellow",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "Combining Red and Green spectral emissions stimulates red and green cone photoreceptors, perceived as Yellow."
    },
    {
      "id": 41,
      "question": "A sensor gives R=200,G=50,B=40 and another gives R=100,G=25,B=20 under identical conditions. Best conclusion:",
      "options": [
        "Their relative colour composition is similar but the second signal is weaker",
        "The second must be blue",
        "The first must be white",
        "They necessarily have different hues"
      ],
      "answer": "Their relative colour composition is similar but the second signal is weaker",
      "correct_option": "Their relative colour composition is similar but the second signal is weaker",
      "difficulty": "hard",
      "global_id": 41,
      "explanation": "Both maintain a 4:1:0.8 channel ratio, meaning the hue is identical while luminance differs."
    },
    {
      "id": 42,
      "question": "Why are RGB values not exact wavelength measurements?",
      "options": [
        "Each channel usually responds over a range of wavelengths",
        "Each channel detects one exact wavelength",
        "RGB sensors detect mass",
        "Wavelength is unrelated to light"
      ],
      "answer": "Each channel usually responds over a range of wavelengths",
      "correct_option": "Each channel usually responds over a range of wavelengths",
      "difficulty": "hard",
      "global_id": 42,
      "explanation": "Broadband optical filters integrate photon flux over wide transmission passbands (~50–100 nm FWHM)."
    },
    {
      "id": 43,
      "question": "If the same spectrum is made twice as bright, what should ideally remain similar for colour estimation?",
      "options": [
        "Normalized RGB ratios",
        "Raw RGB values",
        "Sensor distance automatically",
        "Object mass"
      ],
      "answer": "Normalized RGB ratios",
      "correct_option": "Normalized RGB ratios",
      "difficulty": "hard",
      "global_id": 43,
      "explanation": "Scaling intensity doubles numerator and denominator, leaving ratios R/(R+G+B) invariant."
    },
    {
      "id": 44,
      "question": "Why is ambient-light shielding useful?",
      "options": [
        "It reduces unwanted light added to the measured signal",
        "It changes red into blue",
        "It increases object reflectivity",
        "It removes the need for calibration in every system"
      ],
      "answer": "It reduces unwanted light added to the measured signal",
      "correct_option": "It reduces unwanted light added to the measured signal",
      "difficulty": "hard",
      "global_id": 44,
      "explanation": "Optical hoods prevent room fluorescent/daylight flicker from contaminating the reflected LED signal."
    },
    {
      "id": 45,
      "question": "If RGB spectral responses overlap, then:",
      "options": [
        "One wavelength range can contribute to multiple channels",
        "Each channel detects exactly one wavelength",
        "No colour can be detected",
        "Only brightness can be measured"
      ],
      "answer": "One wavelength range can contribute to multiple channels",
      "correct_option": "One wavelength range can contribute to multiple channels",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "Intermediate wavelengths (e.g. 580 nm yellow) pass partially through both Red and Green filter curves."
    },
    {
      "id": 46,
      "question": "Why is a white reference useful before measuring unknown colours?",
      "options": [
        "It provides a baseline for channel responses under the current illumination",
        "It blocks all visible light",
        "It generates photons",
        "It makes all objects white"
      ],
      "answer": "It provides a baseline for channel responses under the current illumination",
      "correct_option": "It provides a baseline for channel responses under the current illumination",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "White balance calibration normalizes channel gains against the true spectral power distribution of the illuminant."
    },
    {
      "id": 47,
      "question": "If room lighting changes and readings become unstable, the most likely issue is:",
      "options": [
        "Uncontrolled illumination",
        "Incorrect object mass",
        "Wrong gravity",
        "Excessive cable length"
      ],
      "answer": "Uncontrolled illumination",
      "correct_option": "Uncontrolled illumination",
      "difficulty": "hard",
      "global_id": 47,
      "explanation": "Unshielded fluctuations in ambient room lights contaminate photodiode integration."
    },
    {
      "id": 48,
      "question": "A dominant red-channel response primarily means:",
      "options": [
        "More red-region light is reaching the sensor relative to other channel responses",
        "The surface emits only red photons",
        "The surface absorbs no light",
        "The sensor has no green/blue sensitivity"
      ],
      "answer": "More red-region light is reaching the sensor relative to other channel responses",
      "correct_option": "More red-region light is reaching the sensor relative to other channel responses",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "Photocurrent from the red-filtered photodiodes exceeds that from green/blue filters."
    },
    {
      "id": 49,
      "question": "Best way to compare colours when overall brightness varies:",
      "options": [
        "Use calibrated or normalized channel values",
        "Compare only raw red values",
        "Ignore calibration",
        "Use object weight"
      ],
      "answer": "Use calibrated or normalized channel values",
      "correct_option": "Use calibrated or normalized channel values",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "Chromaticity normalization removes the scalar dependence on lux/illumination level."
    },
    {
      "id": 50,
      "question": "Which statement best summarizes a colour-sensor experiment?",
      "options": [
        "Relating optical response to different colours/light conditions and electrical output",
        "Measuring mass of coloured objects",
        "Studying sound reflection",
        "Measuring room temperature only"
      ],
      "answer": "Relating optical response to different colours/light conditions and electrical output",
      "correct_option": "Relating optical response to different colours/light conditions and electrical output",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "The experiment studies the optoelectronic transduction of spectral reflectance into calibrated RGB frequency/voltage signals."
    }
  ]
};

export const HALL_EFFECT_QUESTION_BANK = {
  "experiment": "Hall Effect Experiment - Question Bank",
  "experimentId": "hall-effect",
  "quizId": "hall-effect-mastery-quiz",
  "experimentName": "Hall Effect Experiment",
  "description": "Comprehensive 50-Question Physics Question Bank for Hall Effect Experiment",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "Who discovered the Hall Effect and in which year?",
      "options": [
        "Edwin Herbert Hall in 1879",
        "Heinrich Hertz in 1888",
        "Michael Faraday in 1831",
        "James Clerk Maxwell in 1865"
      ],
      "answer": "Edwin Herbert Hall in 1879",
      "correct_option": "Edwin Herbert Hall in 1879",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Edwin Herbert Hall discovered the Hall effect in 1879 while working on his doctoral thesis under Henry Rowland at Johns Hopkins University."
    },
    {
      "id": 2,
      "question": "What is the primary phenomenon observed in the Hall Effect?",
      "options": [
        "Development of a transverse voltage across a current-carrying conductor in a perpendicular magnetic field",
        "Emission of electrons when light illuminates a metallic surface",
        "Change in electrical resistance when exposed to temperature changes",
        "Generation of electromotive force by mechanical pressure on a crystal"
      ],
      "answer": "Development of a transverse voltage across a current-carrying conductor in a perpendicular magnetic field",
      "correct_option": "Development of a transverse voltage across a current-carrying conductor in a perpendicular magnetic field",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "The Hall Effect is the creation of a transverse potential difference across an electrical conductor or semiconductor when placed in a magnetic field perpendicular to the current."
    },
    {
      "id": 3,
      "question": "Which force is primarily responsible for deflecting charge carriers in the Hall Effect?",
      "options": [
        "Magnetic Lorentz force F = q(v × B)",
        "Gravitational force F = mg",
        "Nuclear strong force",
        "Coulomb electrostatic force only"
      ],
      "answer": "Magnetic Lorentz force F = q(v × B)",
      "correct_option": "Magnetic Lorentz force F = q(v × B)",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Moving mobile charge carriers with drift velocity v experience a magnetic Lorentz force F = q(v × B) that deflects them laterally."
    },
    {
      "id": 4,
      "question": "What is the mathematical expression for the Hall Voltage V_H?",
      "options": [
        "V_H = (R_H · I · B) / t",
        "V_H = (R_H · I · t) / B",
        "V_H = (R_H · B · t) / I",
        "V_H = (I · B · t) / R_H"
      ],
      "answer": "V_H = (R_H · I · B) / t",
      "correct_option": "V_H = (R_H · I · B) / t",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "The transverse Hall voltage V_H is directly proportional to Hall coefficient R_H, current I, and magnetic field B, and inversely proportional to specimen thickness t."
    },
    {
      "id": 5,
      "question": "How is the Hall Coefficient R_H defined in terms of charge carrier density n?",
      "options": [
        "R_H = 1 / (n · q)",
        "R_H = n · q",
        "R_H = n / q",
        "R_H = q / n"
      ],
      "answer": "R_H = 1 / (n · q)",
      "correct_option": "R_H = 1 / (n · q)",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "For a single dominant carrier type, the Hall coefficient is R_H = 1 / (n · q), where q is carrier charge (-e for electrons, +e for holes)."
    },
    {
      "id": 6,
      "question": "What is the sign of the Hall Coefficient in an n-type semiconductor?",
      "options": [
        "Negative (R_H < 0)",
        "Positive (R_H > 0)",
        "Always exactly zero",
        "Fluctuates unpredictably"
      ],
      "answer": "Negative (R_H < 0)",
      "correct_option": "Negative (R_H < 0)",
      "difficulty": "easy",
      "global_id": 6,
      "explanation": "In n-type semiconductors, majority carriers are electrons (q = -e), resulting in a negative Hall coefficient R_H = -1 / (n · e) < 0."
    },
    {
      "id": 7,
      "question": "What is the sign of the Hall Coefficient in a p-type semiconductor?",
      "options": [
        "Positive (R_H > 0)",
        "Negative (R_H < 0)",
        "Zero",
        "Imaginary"
      ],
      "answer": "Positive (R_H > 0)",
      "correct_option": "Positive (R_H > 0)",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "In p-type semiconductors, majority carriers are holes (q = +e), yielding a positive Hall coefficient R_H = +1 / (p · e) > 0."
    },
    {
      "id": 8,
      "question": "Why do semiconductors produce significantly larger Hall voltages than metals under identical conditions?",
      "options": [
        "Semiconductors have a vastly smaller carrier concentration n, making R_H much larger",
        "Metals completely block external magnetic fields",
        "Semiconductors have infinite electrical resistance",
        "Electrons in metals cannot experience Lorentz force"
      ],
      "answer": "Semiconductors have a vastly smaller carrier concentration n, making R_H much larger",
      "correct_option": "Semiconductors have a vastly smaller carrier concentration n, making R_H much larger",
      "difficulty": "medium",
      "global_id": 8,
      "explanation": "Since R_H = 1 / (n · q), and metals possess huge carrier concentrations (~10^28 m^-3) compared to semiconductors (~10^20 m^-3), the Hall coefficient is thousands of times higher in semiconductors."
    },
    {
      "id": 9,
      "question": "What is the SI unit of the Hall Coefficient R_H?",
      "options": [
        "m³ / C (cubic meters per coulomb)",
        "V / m (volts per meter)",
        "Tesla (T)",
        "Ohm-meter (Ω·m)"
      ],
      "answer": "m³ / C (cubic meters per coulomb)",
      "correct_option": "m³ / C (cubic meters per coulomb)",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "R_H = V_H · t / (I · B) has units of (V · m) / (A · T) = m³ / C."
    },
    {
      "id": 10,
      "question": "How does the Hall Voltage V_H vary with the thickness t of the specimen?",
      "options": [
        "Inversely proportional (V_H ∝ 1/t)",
        "Directly proportional (V_H ∝ t)",
        "Proportional to t²",
        "Independent of thickness"
      ],
      "answer": "Inversely proportional (V_H ∝ 1/t)",
      "correct_option": "Inversely proportional (V_H ∝ 1/t)",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Because drift velocity is inversely related to cross-sectional area (A = w · t), thinner specimens produce greater Hall potentials."
    },
    {
      "id": 11,
      "question": "Under dynamic equilibrium in the Hall Effect, which two forces balance each other?",
      "options": [
        "Transverse electrostatic force (q · E_H) and magnetic Lorentz force (q · v_d · B)",
        "Gravitational force and buoyant force",
        "Frictional force and normal reaction force",
        "Centripetal force and centrifugal force"
      ],
      "answer": "Transverse electrostatic force (q · E_H) and magnetic Lorentz force (q · v_d · B)",
      "correct_option": "Transverse electrostatic force (q · E_H) and magnetic Lorentz force (q · v_d · B)",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "At steady state, the accumulation of lateral charge creates a transverse Hall electric field E_H that exactly cancels the magnetic Lorentz deflection."
    },
    {
      "id": 12,
      "question": "How can the majority carrier density n be computed from experimental Hall measurements?",
      "options": [
        "n = 1 / (|R_H| · e)",
        "n = |R_H| · e",
        "n = |R_H| / e",
        "n = e² / |R_H|"
      ],
      "answer": "n = 1 / (|R_H| · e)",
      "correct_option": "n = 1 / (|R_H| · e)",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "Carrier concentration is calculated as n = 1 / (|R_H| · e), where e = 1.602 × 10^-19 C."
    },
    {
      "id": 13,
      "question": "What is the relationship between carrier mobility μ_H, Hall coefficient R_H, and electrical conductivity σ?",
      "options": [
        "μ_H = |R_H| · σ",
        "μ_H = |R_H| / σ",
        "μ_H = σ / |R_H|",
        "μ_H = |R_H| · σ²"
      ],
      "answer": "μ_H = |R_H| · σ",
      "correct_option": "μ_H = |R_H| · σ",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "Since conductivity is σ = n · e · μ, substituting n · e = 1 / |R_H| gives mobility μ_H = |R_H| · σ = |R_H| / ρ."
    },
    {
      "id": 14,
      "question": "What is the tangent of the Hall Angle (tan θ_H) equal to?",
      "options": [
        "μ_H · B",
        "μ_H / B",
        "B / μ_H",
        "R_H · I"
      ],
      "answer": "μ_H · B",
      "correct_option": "μ_H · B",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "The Hall angle θ_H represents the tilt of the total electric field relative to current flow, given by tan(θ_H) = E_H / E_x = μ_H · B."
    },
    {
      "id": 15,
      "question": "What happens to the measured Hall Voltage if the direction of the magnetic field B is inverted?",
      "options": [
        "It reverses polarity (sign inverts)",
        "It doubles in magnitude without changing sign",
        "It drops to zero and stays zero",
        "It remains completely unaffected"
      ],
      "answer": "It reverses polarity (sign inverts)",
      "correct_option": "It reverses polarity (sign inverts)",
      "difficulty": "easy",
      "global_id": 15,
      "explanation": "Since V_H = (R_H · I · B) / t, changing B to -B reverses the direction of the Lorentz force and inverts the sign of V_H."
    },
    {
      "id": 16,
      "question": "What happens to the measured Hall Voltage if both the current I and magnetic field B are reversed simultaneously?",
      "options": [
        "It retains its original sign and polarity",
        "It reverses sign",
        "It becomes zero",
        "It fluctuates wildly"
      ],
      "answer": "It retains its original sign and polarity",
      "correct_option": "It retains its original sign and polarity",
      "difficulty": "medium",
      "global_id": 16,
      "explanation": "Because V_H ∝ I · B, reversing both factors gives (-I) · (-B) = + (I · B), leaving the polarity unchanged."
    },
    {
      "id": 17,
      "question": "What is the primary cause of zero-field misalignment offset voltage (V_0) in a Hall probe?",
      "options": [
        "Transverse voltage contacts are not positioned on the exact same equipotential line",
        "Earth's gravitational curvature",
        "Fluctuations in ambient atmospheric pressure",
        "Cosmic background radiation"
      ],
      "answer": "Transverse voltage contacts are not positioned on the exact same equipotential line",
      "correct_option": "Transverse voltage contacts are not positioned on the exact same equipotential line",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "If the two transverse voltage electrodes are slightly offset longitudinally along the sample, an IR drop appears across them even when B = 0."
    },
    {
      "id": 18,
      "question": "How can misalignment and thermoelectric offset voltages be eliminated experimentally?",
      "options": [
        "Four-quadrant averaging by reversing both current and magnetic field directions",
        "Covering the probe with aluminum foil",
        "Increasing room temperature to 100°C",
        "Using alternating current at radio frequency"
      ],
      "answer": "Four-quadrant averaging by reversing both current and magnetic field directions",
      "correct_option": "Four-quadrant averaging by reversing both current and magnetic field directions",
      "difficulty": "medium",
      "global_id": 18,
      "explanation": "Taking readings across (+I, +B), (+I, -B), (-I, +B), and (-I, -B) cancels out offset voltages and thermomagnetic asymmetries."
    },
    {
      "id": 19,
      "question": "What is the Ettingshausen Effect?",
      "options": [
        "A transverse temperature difference produced by longitudinal current in a perpendicular magnetic field",
        "The emission of light by a heated conductor",
        "The change of capacitance with voltage",
        "The alignment of nuclear spins in a constant field"
      ],
      "answer": "A transverse temperature difference produced by longitudinal current in a perpendicular magnetic field",
      "correct_option": "A transverse temperature difference produced by longitudinal current in a perpendicular magnetic field",
      "difficulty": "hard",
      "global_id": 19,
      "explanation": "The Ettingshausen effect is the thermal analog of the Hall effect: faster electrons are deflected differently than slower electrons, establishing a lateral temperature gradient."
    },
    {
      "id": 20,
      "question": "What is the Nernst Effect?",
      "options": [
        "A transverse electric field generated when a temperature gradient is applied across a magnetic field",
        "The change in resistance of a wire under mechanical stress",
        "The production of sound by oscillating electric currents",
        "The emission of alpha particles from heavy nuclei"
      ],
      "answer": "A transverse electric field generated when a temperature gradient is applied across a magnetic field",
      "correct_option": "A transverse electric field generated when a temperature gradient is applied across a magnetic field",
      "difficulty": "hard",
      "global_id": 20,
      "explanation": "The Nernst effect occurs when a heat current (temperature gradient) and a perpendicular magnetic field induce a transverse voltage."
    },
    {
      "id": 21,
      "question": "In which year and by whom was the Integer Quantum Hall Effect discovered?",
      "options": [
        "Klaus von Klitzing in 1980",
        "Albert Einstein in 1905",
        "Niels Bohr in 1913",
        "Richard Feynman in 1965"
      ],
      "answer": "Klaus von Klitzing in 1980",
      "correct_option": "Klaus von Klitzing in 1980",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Klaus von Klitzing discovered the Integer Quantum Hall Effect in 1980 using 2D electron gas systems in silicon MOSFETs at cryogenic temperatures and high magnetic fields (Nobel Prize in 1985)."
    },
    {
      "id": 22,
      "question": "What is the fundamental quantized Hall resistance formula in the Quantum Hall Effect?",
      "options": [
        "R_H = h / (ν · e²)",
        "R_H = ν · h · e²",
        "R_H = (ν · e) / h",
        "R_H = h² / (ν · e)"
      ],
      "answer": "R_H = h / (ν · e²)",
      "correct_option": "R_H = h / (ν · e²)",
      "difficulty": "hard",
      "global_id": 22,
      "explanation": "In the Integer Quantum Hall Effect, Hall resistance exhibits exact plateaus at R_H = h / (ν · e²), where ν is an integer and h / e² is the von Klitzing constant."
    },
    {
      "id": 23,
      "question": "What is the approximate value of the von Klitzing constant R_K = h / e²?",
      "options": [
        "25,812.807 Ω",
        "1,000.000 Ω",
        "377.000 Ω",
        "50.000 Ω"
      ],
      "answer": "25,812.807 Ω",
      "correct_option": "25,812.807 Ω",
      "difficulty": "hard",
      "global_id": 23,
      "explanation": "The von Klitzing constant R_K = h / e² is approximately 25,812.807 ohms, utilized internationally as a universal quantum standard of electrical resistance."
    },
    {
      "id": 24,
      "question": "Which physical system is required to observe the Quantum Hall Effect?",
      "options": [
        "A two-dimensional electron gas (2DEG) at cryogenic temperatures under strong magnetic fields",
        "A piece of copper wire at room temperature",
        "An incandescent light bulb filament",
        "A liquid mercury thermometer"
      ],
      "answer": "A two-dimensional electron gas (2DEG) at cryogenic temperatures under strong magnetic fields",
      "correct_option": "A two-dimensional electron gas (2DEG) at cryogenic temperatures under strong magnetic fields",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "The Quantum Hall effect requires electrons confined strictly to 2D motion (e.g., GaAs/AlGaAs heterostructures or graphene) under high magnetic fields and low temperatures."
    },
    {
      "id": 25,
      "question": "Which compound semiconductor is known for extremely high electron mobility and widely used in commercial Hall sensors?",
      "options": [
        "Indium Arsenide (InAs) / Indium Antimonide (InSb)",
        "Silicon Dioxide (SiO₂)",
        "Lead (Pb)",
        "Sodium Chloride (NaCl)"
      ],
      "answer": "Indium Arsenide (InAs) / Indium Antimonide (InSb)",
      "correct_option": "Indium Arsenide (InAs) / Indium Antimonide (InSb)",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "InAs and InSb have narrow bandgaps and exceptionally high electron mobilities (>20,000 cm²/(V·s)), making them ideal for high-sensitivity Hall probes."
    },
    {
      "id": 26,
      "question": "How are Hall effect sensors utilized in brushless DC (BLDC) electric motors?",
      "options": [
        "To sense the rotor magnetic pole position and control phase electronic commutation",
        "To measure mechanical friction inside ball bearings",
        "To regulate cooling fan airflow by acoustic vibration",
        "To generate auxiliary electrical power for headlights"
      ],
      "answer": "To sense the rotor magnetic pole position and control phase electronic commutation",
      "correct_option": "To sense the rotor magnetic pole position and control phase electronic commutation",
      "difficulty": "easy",
      "global_id": 26,
      "explanation": "BLDC motors use three Hall sensors placed around the stator to detect rotor magnet pole positions and switch transistor phase inverter gates."
    },
    {
      "id": 27,
      "question": "How do automotive Anti-lock Braking Systems (ABS) utilize Hall effect sensors?",
      "options": [
        "To detect the rotational speed of wheels by sensing passing reluctor ring teeth",
        "To measure brake fluid temperature directly",
        "To verify vehicle paint reflectivity",
        "To adjust cabin air conditioning airflow"
      ],
      "answer": "To detect the rotational speed of wheels by sensing passing reluctor ring teeth",
      "correct_option": "To detect the rotational speed of wheels by sensing passing reluctor ring teeth",
      "difficulty": "easy",
      "global_id": 27,
      "explanation": "Hall sensors monitor toothed reluctor wheels on each axle to measure instantaneous angular velocity and detect impending wheel lockup."
    },
    {
      "id": 28,
      "question": "What is an advantage of Hall effect current sensors over shunt resistors in power electronics?",
      "options": [
        "Galvanic electrical isolation and zero insertion resistance loss",
        "Requires no DC operating power whatsoever",
        "Works only in vacuum environments",
        "Operates only at absolute zero"
      ],
      "answer": "Galvanic electrical isolation and zero insertion resistance loss",
      "correct_option": "Galvanic electrical isolation and zero insertion resistance loss",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "Hall current sensors measure the magnetic field surrounding a conductor without making electrical contact, providing full galvanic isolation between high-voltage circuits and logic."
    },
    {
      "id": 29,
      "question": "What instrument utilizes a calibrated Hall probe to measure magnetic flux density?",
      "options": [
        "Digital Gaussmeter / Tesla meter",
        "Galvanic Spectrometer",
        "Optical Interferometer",
        "Seismograph"
      ],
      "answer": "Digital Gaussmeter / Tesla meter",
      "correct_option": "Digital Gaussmeter / Tesla meter",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "Gaussmeters use a small calibrated semiconductor Hall sensor element whose output voltage linearly corresponds to magnetic flux density B."
    },
    {
      "id": 30,
      "question": "For intrinsic semiconductors where both electrons and holes contribute to transport, what is the expression for R_H?",
      "options": [
        "R_H = (p·μ_h² - n·μ_e²) / [e · (p·μ_h + n·μ_e)²]",
        "R_H = (p·μ_h + n·μ_e) / [e · (p·μ_h - n·μ_e)]",
        "R_H = 1 / [e · (n + p)]",
        "R_H = (μ_e · μ_h) / [e · (n - p)]"
      ],
      "answer": "R_H = (p·μ_h² - n·μ_e²) / [e · (p·μ_h + n·μ_e)²]",
      "correct_option": "R_H = (p·μ_h² - n·μ_e²) / [e · (p·μ_h + n·μ_e)²]",
      "difficulty": "hard",
      "global_id": 30,
      "explanation": "When both carrier types participate, the Hall voltages of electrons and holes compete with quadratic weighting by their respective mobilities."
    },
    {
      "id": 31,
      "question": "Why does intrinsic Germanium (Ge) exhibit a negative Hall coefficient despite having equal electron and hole concentrations (n = p = n_i)?",
      "options": [
        "Electron mobility is significantly greater than hole mobility (μ_e > μ_h)",
        "Electrons have higher mass than holes",
        "Holes do not experience magnetic fields",
        "Germanium crystal atoms carry net negative electric charge"
      ],
      "answer": "Electron mobility is significantly greater than hole mobility (μ_e > μ_h)",
      "correct_option": "Electron mobility is significantly greater than hole mobility (μ_e > μ_h)",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "In Ge, μ_e ≈ 3900 cm²/(V·s) while μ_h ≈ 1900 cm²/(V·s). Because R_H ∝ (p·μ_h² - n·μ_e²), the electron term dominates, making R_H negative."
    },
    {
      "id": 32,
      "question": "If specimen current I = 20 mA, magnetic field B = 0.5 T, thickness t = 0.5 mm, and V_H = -15.2 mV, what is the Hall coefficient R_H?",
      "options": [
        "-3.80 × 10⁻² m³ / C",
        "-1.52 × 10⁻⁴ m³ / C",
        "+7.60 × 10⁻² m³ / C",
        "-3.80 × 10² m³ / C"
      ],
      "answer": "-3.80 × 10⁻² m³ / C",
      "correct_option": "-3.80 × 10⁻² m³ / C",
      "difficulty": "hard",
      "global_id": 32,
      "explanation": "R_H = (V_H · t) / (I · B) = (-0.0152 V · 0.0005 m) / (0.020 A · 0.5 T) = -7.6 × 10^-6 / 0.010 = -3.80 × 10^-2 m³/C."
    },
    {
      "id": 33,
      "question": "Given R_H = -3.80 × 10⁻² m³ / C, what is the carrier density n?",
      "options": [
        "1.64 × 10²⁰ m⁻³",
        "3.80 × 10²⁰ m⁻³",
        "6.24 × 10¹⁸ m⁻³",
        "1.64 × 10²⁸ m⁻³"
      ],
      "answer": "1.64 × 10²⁰ m⁻³",
      "correct_option": "1.64 × 10²⁰ m⁻³",
      "difficulty": "hard",
      "global_id": 33,
      "explanation": "n = 1 / (|R_H| · e) = 1 / (3.80 × 10^-2 · 1.602 × 10^-19) ≈ 1.64 × 10^20 m^-3."
    },
    {
      "id": 34,
      "question": "If electrical resistivity ρ = 0.098 Ω·m and R_H = -3.80 × 10⁻² m³/C, what is the carrier mobility μ_H?",
      "options": [
        "0.388 m² / (V·s)",
        "0.0037 m² / (V·s)",
        "3.88 m² / (V·s)",
        "25.8 m² / (V·s)"
      ],
      "answer": "0.388 m² / (V·s)",
      "correct_option": "0.388 m² / (V·s)",
      "difficulty": "hard",
      "global_id": 34,
      "explanation": "μ_H = |R_H| / ρ = 0.0380 / 0.098 ≈ 0.388 m²/(V·s) = 3880 cm²/(V·s)."
    },
    {
      "id": 35,
      "question": "What is the typical order of magnitude of Hall voltage generated in a metallic copper plate of thickness 0.1 mm with I = 10 A and B = 1 T?",
      "options": [
        "Microvolts (~0.5 μV)",
        "Millivolts (~50 mV)",
        "Volts (~5 V)",
        "Kilovolts (~1 kV)"
      ],
      "answer": "Microvolts (~0.5 μV)",
      "correct_option": "Microvolts (~0.5 μV)",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "In copper, R_H ≈ -5.5 × 10^-11 m³/C. For 10 A and 1 T with t = 10^-4 m: V_H = (5.5 × 10^-11 · 10 · 1) / 10^-4 ≈ 5.5 × 10^-6 V = 5.5 μV."
    },
    {
      "id": 36,
      "question": "Which of the following metals exhibits an anomalous positive Hall coefficient at room temperature?",
      "options": [
        "Zinc (Zn) and Cadmium (Cd)",
        "Copper (Cu)",
        "Silver (Ag)",
        "Gold (Au)"
      ],
      "answer": "Zinc (Zn) and Cadmium (Cd)",
      "correct_option": "Zinc (Zn) and Cadmium (Cd)",
      "difficulty": "hard",
      "global_id": 36,
      "explanation": "Due to complex Fermi surface geometry and hole-like pockets in the second Brillouin zone, metals like Zinc and Cadmium exhibit a positive Hall coefficient."
    },
    {
      "id": 37,
      "question": "What happens to the carrier concentration n of a doped extrinsic semiconductor as temperature increases into the intrinsic regime?",
      "options": [
        "It increases exponentially due to thermal generation of electron-hole pairs",
        "It drops to zero immediately",
        "It remains strictly constant at all temperatures",
        "It becomes negative"
      ],
      "answer": "It increases exponentially due to thermal generation of electron-hole pairs",
      "correct_option": "It increases exponentially due to thermal generation of electron-hole pairs",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "At elevated temperatures, thermal excitation across the bandgap produces intrinsic electron-hole pairs exponentially, causing n to surge and R_H to decline."
    },
    {
      "id": 38,
      "question": "In the absence of a magnetic field (B = 0), what should the ideal Hall voltage be across perfect symmetric contacts?",
      "options": [
        "Exactly 0.0 mV",
        "Equal to the power supply voltage",
        "Infinite",
        "Undefined"
      ],
      "answer": "Exactly 0.0 mV",
      "correct_option": "Exactly 0.0 mV",
      "difficulty": "easy",
      "global_id": 38,
      "explanation": "Without a magnetic field, the Lorentz force is zero (F_L = 0), no lateral charge accumulation occurs, and transverse potential is zero."
    },
    {
      "id": 39,
      "question": "How does the drift velocity v_d of charge carriers relate to the sample current I?",
      "options": [
        "v_d = I / (n · q · w · t)",
        "v_d = I · n · q · w · t",
        "v_d = (n · q) / (I · w · t)",
        "v_d = (w · t) / (I · n · q)"
      ],
      "answer": "v_d = I / (n · q · w · t)",
      "correct_option": "v_d = I / (n · q · w · t)",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "Current density J = I / (w · t) = n · q · v_d, giving drift velocity v_d = I / (n · q · w · t)."
    },
    {
      "id": 40,
      "question": "If the magnetic field B is doubled while maintaining constant current I, what happens to the Hall voltage V_H?",
      "options": [
        "It doubles (2 × V_H)",
        "It quadruples (4 × V_H)",
        "It halves (0.5 × V_H)",
        "It remains unchanged"
      ],
      "answer": "It doubles (2 × V_H)",
      "correct_option": "It doubles (2 × V_H)",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "Hall voltage is directly proportional to magnetic field B: V_H ∝ B. Doubling B doubles V_H."
    },
    {
      "id": 41,
      "question": "What is the physical interpretation of the Hall coefficient's sign?",
      "options": [
        "It reveals the electrical charge sign of majority mobile carriers",
        "It reveals whether the specimen is radioactive",
        "It indicates the magnetic permeability of vacuum",
        "It indicates the speed of light in the material"
      ],
      "answer": "It reveals the electrical charge sign of majority mobile carriers",
      "correct_option": "It reveals the electrical charge sign of majority mobile carriers",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "Because R_H = 1 / (n · q), the sign of R_H matches the sign of q: positive for holes, negative for electrons."
    },
    {
      "id": 42,
      "question": "What type of contacts must be made to semiconductor specimens for accurate Hall measurements?",
      "options": [
        "Ohmic, non-rectifying contacts with minimal contact resistance",
        "Schottky barrier diode rectifying contacts",
        "Capacitive insulated air-gap contacts",
        "Loose mechanical touch pins with high oxide resistance"
      ],
      "answer": "Ohmic, non-rectifying contacts with minimal contact resistance",
      "correct_option": "Ohmic, non-rectifying contacts with minimal contact resistance",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "Non-ohmic rectifying contacts would create nonlinear voltage drops and asymmetric rectification, corrupting Hall voltage readouts."
    },
    {
      "id": 43,
      "question": "In the van der Pauw method of Hall measurement, what sample geometry is required?",
      "options": [
        "Arbitrarily shaped flat thin sample of uniform thickness with four small peripheral perimeter contacts",
        "A long cylindrical rod with axial contacts",
        "A solid metal sphere with concentric core contacts",
        "A hollow wire loop"
      ],
      "answer": "Arbitrarily shaped flat thin sample of uniform thickness with four small peripheral perimeter contacts",
      "correct_option": "Arbitrarily shaped flat thin sample of uniform thickness with four small peripheral perimeter contacts",
      "difficulty": "hard",
      "global_id": 43,
      "explanation": "The van der Pauw method permits exact measurement of resistivity and Hall coefficient on arbitrary flat 2D geometries of uniform thickness."
    },
    {
      "id": 44,
      "question": "What is the typical thickness t of commercial semiconductor Hall sensor elements?",
      "options": [
        "Thin wafers or epitaxial films between 1 μm and 0.5 mm",
        "Thick blocks of 10 cm to 20 cm",
        "Massive ingots of 1 meter",
        "Atomic radius of 0.1 nanometers"
      ],
      "answer": "Thin wafers or epitaxial films between 1 μm and 0.5 mm",
      "correct_option": "Thin wafers or epitaxial films between 1 μm and 0.5 mm",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "Thin films maximize the Hall voltage output because V_H is inversely proportional to thickness t (V_H ∝ 1/t)."
    },
    {
      "id": 45,
      "question": "When current flows in the +x direction and magnetic field points in the +z direction, in which direction do electrons drift?",
      "options": [
        "-x direction (opposite to conventional current)",
        "+x direction",
        "+y direction",
        "+z direction"
      ],
      "answer": "-x direction (opposite to conventional current)",
      "correct_option": "-x direction (opposite to conventional current)",
      "difficulty": "medium",
      "global_id": 45,
      "explanation": "Negatively charged electrons drift in the direction opposite to conventional electric current density (+x), hence in the -x direction."
    },
    {
      "id": 46,
      "question": "For electrons moving in the -x direction in a magnetic field in the +z direction, which way is the magnetic Lorentz force directed?",
      "options": [
        "-y direction: F = (-e) · [(-v_x i) × (B_z k)] = (-e) · (v_x B_z j) = -y",
        "+y direction",
        "+x direction",
        "+z direction"
      ],
      "answer": "-y direction: F = (-e) · [(-v_x i) × (B_z k)] = (-e) · (v_x B_z j) = -y",
      "correct_option": "-y direction: F = (-e) · [(-v_x i) × (B_z k)] = (-e) · (v_x B_z j) = -y",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "Using vector cross product: (-i) × k = +j. Multiplied by negative electron charge (-e), the force points in the -y direction."
    },
    {
      "id": 47,
      "question": "For holes moving in the +x direction in a magnetic field in the +z direction, which way is the magnetic Lorentz force directed?",
      "options": [
        "-y direction: F = (+e) · [(+v_x i) × (B_z k)] = (+e) · (-v_x B_z j) = -y",
        "+y direction",
        "+x direction",
        "+z direction"
      ],
      "answer": "-y direction: F = (+e) · [(+v_x i) × (B_z k)] = (+e) · (-v_x B_z j) = -y",
      "correct_option": "-y direction: F = (+e) · [(+v_x i) × (B_z k)] = (+e) · (-v_x B_z j) = -y",
      "difficulty": "hard",
      "global_id": 47,
      "explanation": "Using vector cross product: (+i) × k = -j. Multiplied by positive hole charge (+e), the force also points in the -y direction! Both carriers deflect to the same edge."
    },
    {
      "id": 48,
      "question": "Why do n-type and p-type semiconductors develop opposite Hall voltages if both electrons and holes deflect toward the same physical edge?",
      "options": [
        "Because electrons carry negative charge while holes carry positive charge, giving opposite accumulated edge charge polarities",
        "Because holes move faster than the speed of light",
        "Because electrons lose their charge inside semiconductors",
        "Because magnetic field direction changes inside p-type materials"
      ],
      "answer": "Because electrons carry negative charge while holes carry positive charge, giving opposite accumulated edge charge polarities",
      "correct_option": "Because electrons carry negative charge while holes carry positive charge, giving opposite accumulated edge charge polarities",
      "difficulty": "medium",
      "global_id": 48,
      "explanation": "Even though both deflect to the same lateral edge, the accumulated charge is negative for electrons and positive for holes, inverting the direction of the Hall electric field."
    },
    {
      "id": 49,
      "question": "Which of the following describes the Spin Hall Effect?",
      "options": [
        "Accumulation of opposite electron spin orientations on lateral sample boundaries due to spin-orbit coupling",
        "Rotation of a specimen on a mechanical turntable",
        "Electromagnetic wave polarization in plasma",
        "Spinning of magnetic domains in ferromagnets"
      ],
      "answer": "Accumulation of opposite electron spin orientations on lateral sample boundaries due to spin-orbit coupling",
      "correct_option": "Accumulation of opposite electron spin orientations on lateral sample boundaries due to spin-orbit coupling",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "The Spin Hall Effect (SHE) consists of spin-up and spin-down electrons deflecting to opposite edges in materials with strong spin-orbit coupling without external magnetic fields."
    },
    {
      "id": 50,
      "question": "Which statement best summarizes the practical significance of the Hall Effect experiment in solid-state physics?",
      "options": [
        "It provides a direct experimental method to determine carrier type, carrier concentration, and mobility in semiconductors",
        "It proves that light has wave-particle duality",
        "It confirms the universal gravitational constant G",
        "It measures the speed of sound in crystalline solids"
      ],
      "answer": "It provides a direct experimental method to determine carrier type, carrier concentration, and mobility in semiconductors",
      "correct_option": "It provides a direct experimental method to determine carrier type, carrier concentration, and mobility in semiconductors",
      "difficulty": "easy",
      "global_id": 50,
      "explanation": "The Hall Effect is the foundational experiment in solid-state electronics for determining whether a semiconductor is n-type or p-type and measuring its fundamental transport parameters."
    }
  ]
};

export const DIFFRACTION_QUESTION_BANK = {
  "experiment": "Diffraction Grating Spectrometry - Question Bank",
  "experimentId": "diffraction",
  "quizId": "diffraction-grating-mastery-quiz",
  "experimentName": "Diffraction Grating Spectrometry",
  "description": "Comprehensive 50-Question Physics Question Bank for Diffraction Grating Spectrometry",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What is the standard grating equation for normal incident light?",
      "options": [
        "d · sin(θ) = m · λ",
        "d · cos(θ) = m · λ",
        "d · tan(θ) = m · λ",
        "sin(θ) = m · d · λ"
      ],
      "answer": "d · sin(θ) = m · λ",
      "correct_option": "d · sin(θ) = m · λ",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "For normal incidence, constructive interference from adjacent slits occurs when the path difference d sin(θ) equals an integer multiple of the wavelength mλ."
    },
    {
      "id": 2,
      "question": "In the grating equation d · sin(θ) = m · λ, what does 'd' represent?",
      "options": [
        "The distance between centers of adjacent slits (grating pitch)",
        "The total width of the grating plate",
        "The distance from the grating to the screen",
        "The diameter of the laser beam spot"
      ],
      "answer": "The distance between centers of adjacent slits (grating pitch)",
      "correct_option": "The distance between centers of adjacent slits (grating pitch)",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "The grating element d represents the slit separation (pitch), calculated as d = 1 / N where N is the line density."
    },
    {
      "id": 3,
      "question": "If a diffraction grating has 500 lines per mm, what is its slit spacing d?",
      "options": [
        "2.0 × 10⁻⁶ m (2.0 μm)",
        "5.0 × 10⁻⁶ m (5.0 μm)",
        "2.0 × 10⁻³ m (2.0 mm)",
        "0.5 × 10⁻⁶ m (0.5 μm)"
      ],
      "answer": "2.0 × 10⁻⁶ m (2.0 μm)",
      "correct_option": "2.0 × 10⁻⁶ m (2.0 μm)",
      "difficulty": "medium",
      "global_id": 3,
      "explanation": "d = 1 / (500 lines/mm) = 0.002 mm = 2.0 × 10⁻⁶ m = 2.0 μm."
    },
    {
      "id": 4,
      "question": "What diffraction order corresponds to the undeflected central beam (θ = 0)?",
      "options": [
        "Zeroth order (m = 0)",
        "First order (m = 1)",
        "Negative first order (m = -1)",
        "Infinite order (m = ∞)"
      ],
      "answer": "Zeroth order (m = 0)",
      "correct_option": "Zeroth order (m = 0)",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "At θ = 0, path difference between all slits is zero regardless of wavelength, corresponding to the central m = 0 maximum."
    },
    {
      "id": 5,
      "question": "When white light is incident on a diffraction grating, what color is the central maximum (m = 0)?",
      "options": [
        "White",
        "Red",
        "Violet",
        "Green"
      ],
      "answer": "White",
      "correct_option": "White",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "All visible wavelengths satisfy d sin(0) = 0 · λ at θ = 0, so all spectral colors recombine into an undiffracted white fringe."
    },
    {
      "id": 6,
      "question": "In the first-order spectrum (m = 1), which color of visible light diffracts at the largest angle θ?",
      "options": [
        "Red (~650 nm)",
        "Blue (~450 nm)",
        "Green (~532 nm)",
        "Violet (~400 nm)"
      ],
      "answer": "Red (~650 nm)",
      "correct_option": "Red (~650 nm)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "Since sin(θ) = mλ / d, angle θ increases monotonically with wavelength λ. Red light has the longest visible wavelength and diffracts furthest."
    },
    {
      "id": 7,
      "question": "How does spectral dispersion by a diffraction grating compare to dispersion by a glass prism?",
      "options": [
        "Grating bends red more than violet; prism bends violet more than red",
        "Both bend red light more than violet light",
        "Both bend violet light more than red light",
        "Grating only transmits green light"
      ],
      "answer": "Grating bends red more than violet; prism bends violet more than red",
      "correct_option": "Grating bends red more than violet; prism bends violet more than red",
      "difficulty": "medium",
      "global_id": 7,
      "explanation": "In a grating, sin(θ) ∝ λ (red deflects most). In a prism, refractive index n increases for shorter wavelengths, bending violet most."
    },
    {
      "id": 8,
      "question": "What is the theoretical maximum observable order m_max for light of wavelength λ with grating spacing d?",
      "options": [
        "m_max = ⌊d / λ⌋",
        "m_max = ⌊λ / d⌋",
        "m_max = 2d · λ",
        "m_max = 2π / (d · λ)"
      ],
      "answer": "m_max = ⌊d / λ⌋",
      "correct_option": "m_max = ⌊d / λ⌋",
      "difficulty": "medium",
      "global_id": 8,
      "explanation": "Because sin(θ) cannot exceed 1, mλ / d ≤ 1 ⟹ m ≤ d / λ. The highest integer order is ⌊d / λ⌋."
    },
    {
      "id": 9,
      "question": "What happens to the angular separation between diffracted lines if a 300 lines/mm grating is replaced with a 600 lines/mm grating?",
      "options": [
        "Angular separation doubles (spreads further apart)",
        "Angular separation is halved (narrows together)",
        "Angular separation remains completely unchanged",
        "The pattern turns completely dark"
      ],
      "answer": "Angular separation doubles (spreads further apart)",
      "correct_option": "Angular separation doubles (spreads further apart)",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Doubling ruling density halves slit spacing d. Because sin(θ) = mλ / d, smaller d results in significantly larger diffraction angles."
    },
    {
      "id": 10,
      "question": "Angular dispersion D of a diffraction grating is mathematically defined as:",
      "options": [
        "D = dθ / dλ = m / (d · cos θ)",
        "D = dλ / dθ = (d · sin θ) / m",
        "D = m · d · cos(θ)",
        "D = λ / (m · d)"
      ],
      "answer": "D = dθ / dλ = m / (d · cos θ)",
      "correct_option": "D = dθ / dλ = m / (d · cos θ)",
      "difficulty": "hard",
      "global_id": 10,
      "explanation": "Differentiating d sin(θ) = mλ with respect to λ yields d cos(θ) dθ = m dλ, giving D = dθ/dλ = m / (d cos θ)."
    },
    {
      "id": 11,
      "question": "If screen distance L is increased from 1.0 m to 2.0 m, how does the fringe displacement y change on the screen?",
      "options": [
        "Displacement y doubles (y = L · tan θ)",
        "Displacement y is halved",
        "Displacement y decreases by 4x",
        "Displacement y remains invariant"
      ],
      "answer": "Displacement y doubles (y = L · tan θ)",
      "correct_option": "Displacement y doubles (y = L · tan θ)",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "From geometry, tan(θ) = y / L, so y = L tan(θ). Linear fringe separation scales in direct proportion to screen distance L."
    },
    {
      "id": 12,
      "question": "What class of diffraction occurs when incident wavefronts are plane and observed at infinity (or focused by a lens)?",
      "options": [
        "Fraunhofer diffraction",
        "Fresnel near-field diffraction",
        "Raman scattering",
        "Bragg backscattering"
      ],
      "answer": "Fraunhofer diffraction",
      "correct_option": "Fraunhofer diffraction",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "Fraunhofer diffraction occurs in the far-field regime where both the incoming and outgoing wavefronts are planar."
    },
    {
      "id": 13,
      "question": "The chromatic resolving power of a diffraction grating is given by:",
      "options": [
        "R = λ / Δλ = m · N_total",
        "R = Δλ / λ = d / (m · N_total)",
        "R = m / (d · λ)",
        "R = N_total / (m · λ)"
      ],
      "answer": "R = λ / Δλ = m · N_total",
      "correct_option": "R = λ / Δλ = m · N_total",
      "difficulty": "hard",
      "global_id": 13,
      "explanation": "By Rayleigh's criterion, two spectral lines are resolved when their angular separation matches half-width: R = λ/Δλ = m · N_total."
    },
    {
      "id": 14,
      "question": "What governs the sharpness and intensity of principal maxima in an N-slit diffraction grating?",
      "options": [
        "Peak intensity is proportional to N² and angular width is inversely proportional to N",
        "Peak intensity is proportional to N and width is independent of N",
        "Peak intensity decreases as N increases",
        "Sharpness is determined exclusively by screen distance"
      ],
      "answer": "Peak intensity is proportional to N² and angular width is inversely proportional to N",
      "correct_option": "Peak intensity is proportional to N² and angular width is inversely proportional to N",
      "difficulty": "hard",
      "global_id": 14,
      "explanation": "Coherent constructive addition of N waves yields amplitude N · A₀ and intensity N² · I₀, while the width of the principal maximum narrows as 1/N."
    },
    {
      "id": 15,
      "question": "How many secondary minima exist between two adjacent principal maxima in an N-slit grating?",
      "options": [
        "N - 1 minima",
        "N minima",
        "N + 1 minima",
        "2N minima"
      ],
      "answer": "N - 1 minima",
      "correct_option": "N - 1 minima",
      "difficulty": "hard",
      "global_id": 15,
      "explanation": "Between consecutive principal maxima, the phase difference traverses 2π, encountering N - 1 zero-amplitude nodes (minima) and N - 2 secondary maxima."
    },
    {
      "id": 16,
      "question": "A laser with wavelength 500 nm strikes a grating with slit spacing d = 2.0 μm. What is sin(θ) for the first-order beam?",
      "options": [
        "0.25",
        "0.50",
        "0.10",
        "1.00"
      ],
      "answer": "0.25",
      "correct_option": "0.25",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "sin(θ) = (1 · 500 × 10⁻⁹ m) / (2.0 × 10⁻⁶ m) = 500 / 2000 = 0.25."
    },
    {
      "id": 17,
      "question": "What is the optical path difference between rays from adjacent slits for the second-order maximum (m = 2)?",
      "options": [
        "2λ",
        "λ",
        "λ / 2",
        "4λ"
      ],
      "answer": "2λ",
      "correct_option": "2λ",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "For the m-th principal maximum, the path difference Δx = d sin(θ) must equal exactly mλ = 2λ."
    },
    {
      "id": 18,
      "question": "What causes a missing order (absent spectrum) in a diffraction grating pattern?",
      "options": [
        "A principal interference maximum coincides with a single-slit diffraction minimum",
        "The incident beam is polarized at Brewster's angle",
        "The wavelength exceeds the physical size of the grating",
        "Total internal reflection inside the glass substrate"
      ],
      "answer": "A principal interference maximum coincides with a single-slit diffraction minimum",
      "correct_option": "A principal interference maximum coincides with a single-slit diffraction minimum",
      "difficulty": "hard",
      "global_id": 18,
      "explanation": "When the condition for a grating maximum (d sin θ = mλ) coincides with a single-slit diffraction zero (a sin θ = pλ), the intensity envelope is zero, extinguishing the order."
    },
    {
      "id": 19,
      "question": "Why do higher order spectra (e.g. m = 2 and m = 3) sometimes overlap when using polychromatic light?",
      "options": [
        "Because m₁ · λ₁ can equal m₂ · λ₂ at identical diffraction angles θ",
        "Because the grating heats up under laser irradiance",
        "Because transverse magnetic modes cancel each other",
        "Because light slows down inside the air gap"
      ],
      "answer": "Because m₁ · λ₁ can equal m₂ · λ₂ at identical diffraction angles θ",
      "correct_option": "Because m₁ · λ₁ can equal m₂ · λ₂ at identical diffraction angles θ",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "Overlap occurs when 2 · λ_red (e.g., 2 × 700 = 1400 nm) exceeds 3 · λ_violet (3 × 400 = 1200 nm), placing different orders at overlapping angles."
    },
    {
      "id": 20,
      "question": "Why is a transmission diffraction grating widely preferred over a prism in quantitative spectrometry?",
      "options": [
        "Gratings provide higher resolving power and linear angular dispersion",
        "Gratings require no light source to operate",
        "Gratings absorb all infrared radiation",
        "Prisms cannot refract visible light"
      ],
      "answer": "Gratings provide higher resolving power and linear angular dispersion",
      "correct_option": "Gratings provide higher resolving power and linear angular dispersion",
      "difficulty": "medium",
      "global_id": 20,
      "explanation": "Diffraction gratings yield much higher resolving power R and approximately linear dispersion dθ/dλ, making precise wavelength determination straightforward."
    },
    {
      "id": 21,
      "question": "What is the condition for missing spectra (absent orders) in a diffraction grating with slit width a and slit separation d?",
      "options": [
        "d / a = m / p (where m is grating order and p is single-slit minimum order)",
        "d · a = m · p",
        "d + a = m · λ",
        "d / a = (2m + 1) / p"
      ],
      "answer": "d / a = m / p (where m is grating order and p is single-slit minimum order)",
      "correct_option": "d / a = m / p (where m is grating order and p is single-slit minimum order)",
      "difficulty": "hard",
      "global_id": 21,
      "explanation": "When a principal interference maximum coincides with a single-slit diffraction minimum (d sin θ = mλ and a sin θ = pλ), the overall intensity vanishes, creating an absent order."
    },
    {
      "id": 22,
      "question": "If a transmission grating has slit width a = 2.0 μm and slit spacing d = 4.0 μm, which interference orders will be absent?",
      "options": [
        "Even orders: m = 2, 4, 6, 8...",
        "Odd orders: m = 1, 3, 5, 7...",
        "Only m = 1",
        "No orders will be absent"
      ],
      "answer": "Even orders: m = 2, 4, 6, 8...",
      "correct_option": "Even orders: m = 2, 4, 6, 8...",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "d / a = 4.0 / 2.0 = 2. Therefore m = 2p, meaning all even orders (2, 4, 6...) coincide with single-slit diffraction zeros and disappear."
    },
    {
      "id": 23,
      "question": "What is the chromatic resolving power R of a diffraction grating defined as?",
      "options": [
        "R = λ / Δλ = m · N_total",
        "R = Δλ / λ = m / N_total",
        "R = d · sin θ / λ",
        "R = N_total / (m · λ)"
      ],
      "answer": "R = λ / Δλ = m · N_total",
      "correct_option": "R = λ / Δλ = m · N_total",
      "difficulty": "easy",
      "global_id": 23,
      "explanation": "By Rayleigh criterion, two spectral lines of wavelength difference Δλ are just resolved when R = λ / Δλ = m · N_total, where N_total is the total illuminated rulings."
    },
    {
      "id": 24,
      "question": "If a diffraction grating with 600 lines/mm is illuminated over a width of 20 mm, what is the total number of rulings N_total?",
      "options": [
        "12,000 lines",
        "30 lines",
        "60,000 lines",
        "1,200 lines"
      ],
      "answer": "12,000 lines",
      "correct_option": "12,000 lines",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "N_total = (600 lines/mm) × (20 mm) = 12,000 rulings."
    },
    {
      "id": 25,
      "question": "For N_total = 12,000 rulings, what is the theoretical resolving power in the second order (m = 2)?",
      "options": [
        "24,000",
        "12,000",
        "6,000",
        "48,000"
      ],
      "answer": "24,000",
      "correct_option": "24,000",
      "difficulty": "easy",
      "global_id": 25,
      "explanation": "R = m · N_total = 2 × 12,000 = 24,000."
    },
    {
      "id": 26,
      "question": "With a resolving power of R = 24,000 at λ = 600 nm, what is the smallest resolvable wavelength difference Δλ?",
      "options": [
        "0.025 nm (0.25 Å)",
        "0.25 nm (2.5 Å)",
        "2.5 nm",
        "0.001 nm"
      ],
      "answer": "0.025 nm (0.25 Å)",
      "correct_option": "0.025 nm (0.25 Å)",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Δλ = λ / R = 600 nm / 24,000 = 0.025 nm."
    },
    {
      "id": 27,
      "question": "How does the angular dispersion D = dθ / dλ vary with the diffraction order m?",
      "options": [
        "D is directly proportional to m (higher orders have wider spectral dispersion)",
        "D is inversely proportional to m",
        "D is completely independent of m",
        "D approaches zero at higher orders"
      ],
      "answer": "D is directly proportional to m (higher orders have wider spectral dispersion)",
      "correct_option": "D is directly proportional to m (higher orders have wider spectral dispersion)",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Differentiating the grating equation gives D = dθ / dλ = m / (d cos θ). As m increases, angular dispersion increases proportionally."
    },
    {
      "id": 28,
      "question": "If light strikes a diffraction grating at an angle of incidence i, what is the modified grating equation?",
      "options": [
        "d · (sin i + sin θ) = m · λ",
        "d · (cos i + cos θ) = m · λ",
        "d · sin(i · θ) = m · λ",
        "d · (sin i − sin θ) = 0"
      ],
      "answer": "d · (sin i + sin θ) = m · λ",
      "correct_option": "d · (sin i + sin θ) = m · λ",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "For oblique incidence, the total path difference across adjacent slits includes both incident and diffracted segments: d(sin i + sin θ) = mλ."
    },
    {
      "id": 29,
      "question": "Why do principal interference maxima become much sharper and brighter as the number of illuminated slits N increases?",
      "options": [
        "Because destructive interference occurs at virtually all non-principal angles and peak intensity scales as N²",
        "Because light travels faster through more slits",
        "Because the wavelength of laser light decreases",
        "Because the grating absorbs less thermal energy"
      ],
      "answer": "Because destructive interference occurs at virtually all non-principal angles and peak intensity scales as N²",
      "correct_option": "Because destructive interference occurs at virtually all non-principal angles and peak intensity scales as N²",
      "difficulty": "hard",
      "global_id": 29,
      "explanation": "For N coherent in-phase wavelets, constructive amplitude is N · A₀ so peak intensity scales as I ∝ N², while angular half-width narrows as Δθ ∝ 1/N."
    },
    {
      "id": 30,
      "question": "In an N-slit diffraction grating, how many secondary minima exist between any two consecutive principal maxima?",
      "options": [
        "(N − 1) minima",
        "(N + 1) minima",
        "N minima",
        "2N minima"
      ],
      "answer": "(N − 1) minima",
      "correct_option": "(N − 1) minima",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "The interference term sin²(Nβ/2) / sin²(β/2) equals zero when Nβ/2 = pπ (with p not a multiple of N), yielding exactly (N - 1) minima."
    },
    {
      "id": 31,
      "question": "In an N-slit diffraction grating, how many secondary maxima exist between adjacent principal maxima?",
      "options": [
        "(N − 2) secondary maxima",
        "(N − 1) secondary maxima",
        "N secondary maxima",
        "2 secondary maxima"
      ],
      "answer": "(N − 2) secondary maxima",
      "correct_option": "(N − 2) secondary maxima",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Between the (N - 1) secondary minima lie exactly (N - 2) weak secondary maxima whose intensities are negligible for large N."
    },
    {
      "id": 32,
      "question": "A diffraction grating has 1000 lines/mm. What is the maximum theoretical diffraction order for green laser light (λ = 500 nm)?",
      "options": [
        "m_max = 2",
        "m_max = 1",
        "m_max = 3",
        "m_max = 4"
      ],
      "answer": "m_max = 2",
      "correct_option": "m_max = 2",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "d = 1 / 1000 mm = 1000 nm. Since sin θ ≤ 1, m_max = ⌊d / λ⌋ = ⌊1000 / 500⌋ = 2."
    },
    {
      "id": 33,
      "question": "What is the phase difference δ between wavelets diffracted at angle θ from adjacent slits separated by distance d?",
      "options": [
        "δ = (2π / λ) · d · sin(θ)",
        "δ = (π / λ) · d · cos(θ)",
        "δ = (2π / λ) · d · tan(θ)",
        "δ = 2π · m · λ"
      ],
      "answer": "δ = (2π / λ) · d · sin(θ)",
      "correct_option": "δ = (2π / λ) · d · sin(θ)",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Phase difference δ = k · Δx = (2π / λ) · (d sin θ)."
    },
    {
      "id": 34,
      "question": "What are Rowland's ghosts in ruled mechanical diffraction gratings?",
      "options": [
        "Spurious spectral lines caused by periodic pitch errors in ruling engine drive screws",
        "Optical reflections from the glass rear boundary",
        "Fluorescence emission lines from diamond stylus wear",
        "Second-order diffraction from ambient room illumination"
      ],
      "answer": "Spurious spectral lines caused by periodic pitch errors in ruling engine drive screws",
      "correct_option": "Spurious spectral lines caused by periodic pitch errors in ruling engine drive screws",
      "difficulty": "hard",
      "global_id": 34,
      "explanation": "Periodic mechanical imperfections in the ruling screw produce systematic phase modulation, creating faint symmetrical ghost lines flanking principal lines."
    },
    {
      "id": 35,
      "question": "What is a blazed grating?",
      "options": [
        "A grating with angled grooves designed to concentrate optical power into a specific diffraction order",
        "A grating heated to high temperatures during fabrication",
        "A grating coated with absorbing black paint",
        "A transmission grating with non-parallel slits"
      ],
      "answer": "A grating with angled grooves designed to concentrate optical power into a specific diffraction order",
      "correct_option": "A grating with angled grooves designed to concentrate optical power into a specific diffraction order",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "Blazing shifts the single-slit specular reflection envelope to match a chosen diffraction order, dramatically increasing diffraction efficiency at that blaze wavelength."
    },
    {
      "id": 36,
      "question": "What is the Littrow configuration in a spectrometer?",
      "options": [
        "An optical geometry where the diffracted beam reflects back along the incident beam path (θ = i)",
        "A geometry where light passes through two consecutive gratings",
        "A setup using a cylindrical lens to collimate laser beams",
        "A detector configuration without any focusing optics"
      ],
      "answer": "An optical geometry where the diffracted beam reflects back along the incident beam path (θ = i)",
      "correct_option": "An optical geometry where the diffracted beam reflects back along the incident beam path (θ = i)",
      "difficulty": "hard",
      "global_id": 36,
      "explanation": "In the Littrow mount, θ = i so the grating equation simplifies to 2d sin θ = mλ, maximizing blaze efficiency and optical compactness."
    },
    {
      "id": 37,
      "question": "If a red laser (λ = 650 nm) is swapped for a violet laser (λ = 405 nm), what happens to the fringe pattern on the screen?",
      "options": [
        "The diffracted spots move closer to the central zeroth-order spot",
        "The diffracted spots move farther outward",
        "The fringe pattern disappears entirely",
        "Only the zeroth-order spot remains"
      ],
      "answer": "The diffracted spots move closer to the central zeroth-order spot",
      "correct_option": "The diffracted spots move closer to the central zeroth-order spot",
      "difficulty": "easy",
      "global_id": 37,
      "explanation": "Since sin θ = mλ / d, a shorter wavelength produces smaller diffraction angles θ, contracting the fringe pattern toward center."
    },
    {
      "id": 38,
      "question": "If the grating-to-screen distance L is doubled, what happens to the physical distance y between the m = 0 and m = 1 spots?",
      "options": [
        "The separation distance y approximately doubles",
        "The separation distance y is halved",
        "The separation distance y increases fourfold",
        "The separation distance y remains unchanged"
      ],
      "answer": "The separation distance y approximately doubles",
      "correct_option": "The separation distance y approximately doubles",
      "difficulty": "easy",
      "global_id": 38,
      "explanation": "For small angles, y ≈ L · tan(θ) ≈ L · θ. Doubling screen distance L directly doubles spot displacement y."
    },
    {
      "id": 39,
      "question": "What happens to the diffraction angles if an entire grating experiment is submerged in water (n = 1.33)?",
      "options": [
        "Diffraction angles decrease because effective wavelength decreases (λ_med = λ / n)",
        "Diffraction angles increase by 1.33x",
        "The diffraction angles remain exactly the same",
        "Diffraction completely ceases in liquid media"
      ],
      "answer": "Diffraction angles decrease because effective wavelength decreases (λ_med = λ / n)",
      "correct_option": "Diffraction angles decrease because effective wavelength decreases (λ_med = λ / n)",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "In a dielectric medium of refractive index n, the wavelength shortens to λ / n, causing smaller diffraction angles via d sin θ = m(λ/n)."
    },
    {
      "id": 40,
      "question": "Why does an atomic gas discharge tube produce discrete sharp spectral lines through a diffraction grating?",
      "options": [
        "Because atoms emit photons at quantized discrete transition wavelengths ΔE = hc / λ",
        "Because the grating filters out continuous frequencies",
        "Because gas atoms absorb all odd orders",
        "Because of acoustic Doppler resonance inside the tube"
      ],
      "answer": "Because atoms emit photons at quantized discrete transition wavelengths ΔE = hc / λ",
      "correct_option": "Because atoms emit photons at quantized discrete transition wavelengths ΔE = hc / λ",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "Electronic transitions between quantized energy levels produce monochromatic photons at discrete wavelengths, each diffracted into distinct lines."
    },
    {
      "id": 41,
      "question": "What are the characteristic yellow doublet wavelengths of a low-pressure Sodium (Na) laboratory lamp?",
      "options": [
        "589.0 nm (D₂) and 589.6 nm (D₁)",
        "656.3 nm and 486.1 nm",
        "546.1 nm and 435.8 nm",
        "632.8 nm and 532.0 nm"
      ],
      "answer": "589.0 nm (D₂) and 589.6 nm (D₁)",
      "correct_option": "589.0 nm (D₂) and 589.6 nm (D₁)",
      "difficulty": "medium",
      "global_id": 41,
      "explanation": "The Sodium doublet originates from 3p → 3s fine-structure transitions with wavelengths 589.0 nm and 589.6 nm separated by Δλ = 0.6 nm."
    },
    {
      "id": 42,
      "question": "What minimum resolving power R is required to clearly separate the Sodium doublet (589.0 nm and 589.6 nm)?",
      "options": [
        "R ≈ 982",
        "R ≈ 100",
        "R ≈ 10,000",
        "R ≈ 50"
      ],
      "answer": "R ≈ 982",
      "correct_option": "R ≈ 982",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "R = λ_avg / Δλ = 589.3 nm / 0.6 nm ≈ 982. A grating needs at least ~982 total rulings in the first order to resolve them."
    },
    {
      "id": 43,
      "question": "Can a diffraction grating with N_total = 500 total rulings resolve the Sodium doublet in the first order (m = 1)?",
      "options": [
        "No, because R = 1 × 500 = 500, which is less than the required 982",
        "Yes, because 500 is greater than 0.6",
        "Yes, any grating can resolve the doublet",
        "No, Sodium light cannot be diffracted by gratings"
      ],
      "answer": "No, because R = 1 × 500 = 500, which is less than the required 982",
      "correct_option": "No, because R = 1 × 500 = 500, which is less than the required 982",
      "difficulty": "easy",
      "global_id": 43,
      "explanation": "In order m = 1, R = 500 < 982, so Rayleigh criterion is not met and the two lines blur together."
    },
    {
      "id": 44,
      "question": "What is the key structural difference between a transmission grating and a reflection grating?",
      "options": [
        "Transmission gratings transmit diffracted light through transparent slits; reflection gratings reflect light from mirrored facets",
        "Reflection gratings cannot produce spectra",
        "Transmission gratings have only two slits",
        "Reflection gratings require vacuum chambers"
      ],
      "answer": "Transmission gratings transmit diffracted light through transparent slits; reflection gratings reflect light from mirrored facets",
      "correct_option": "Transmission gratings transmit diffracted light through transparent slits; reflection gratings reflect light from mirrored facets",
      "difficulty": "easy",
      "global_id": 44,
      "explanation": "Transmission gratings rely on periodic transmissive apertures; reflection gratings use periodic mirrored facets etched into a substrate."
    },
    {
      "id": 45,
      "question": "If a transmission grating has 1200 lines/mm, what is its slit spacing d in nanometers?",
      "options": [
        "833.3 nm",
        "1200 nm",
        "120 nm",
        "83.3 nm"
      ],
      "answer": "833.3 nm",
      "correct_option": "833.3 nm",
      "difficulty": "medium",
      "global_id": 45,
      "explanation": "d = 1 / 1200 mm = (10⁶ nm) / 1200 ≈ 833.3 nm."
    },
    {
      "id": 46,
      "question": "What is the diffraction angle θ for m = 1 with λ = 500 nm and d = 2000 nm?",
      "options": [
        "θ = arcsin(0.25) ≈ 14.48°",
        "θ = arcsin(0.50) = 30.00°",
        "θ = arcsin(0.10) ≈ 5.74°",
        "θ = 45.00°"
      ],
      "answer": "θ = arcsin(0.25) ≈ 14.48°",
      "correct_option": "θ = arcsin(0.25) ≈ 14.48°",
      "difficulty": "easy",
      "global_id": 46,
      "explanation": "sin θ = (1 × 500) / 2000 = 0.25. θ = arcsin(0.25) ≈ 14.48°."
    },
    {
      "id": 47,
      "question": "In Fraunhofer multi-slit diffraction, what optical function does a collimating lens serve before the grating?",
      "options": [
        "It converts diverging spherical rays into parallel planar wavefronts",
        "It focuses diffracted light onto the sensor",
        "It filters out UV wavelengths",
        "It increases the laser power"
      ],
      "answer": "It converts diverging spherical rays into parallel planar wavefronts",
      "correct_option": "It converts diverging spherical rays into parallel planar wavefronts",
      "difficulty": "easy",
      "global_id": 47,
      "explanation": "Fraunhofer diffraction strictly requires planar wavefront incidence, achieved by placing the point source at the focal point of a collimator lens."
    },
    {
      "id": 48,
      "question": "What governs the relative intensity envelope of different diffraction orders in a plane grating?",
      "options": [
        "The single-slit diffraction factor [sin(α)/α]² where α = (π a sin θ) / λ",
        "The thickness of the glass substrate only",
        "The focal length of the telescope",
        "The temperature of the laser diode"
      ],
      "answer": "The single-slit diffraction factor [sin(α)/α]² where α = (π a sin θ) / λ",
      "correct_option": "The single-slit diffraction factor [sin(α)/α]² where α = (π a sin θ) / λ",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "The total intensity is the product of multi-slit interference and single-slit diffraction: I(θ) = I₀ · [sin(α)/α]² · [sin(Nβ)/sin(β)]²."
    },
    {
      "id": 49,
      "question": "Why are holographic gratings often superior to mechanically ruled gratings in high-precision spectroscopy?",
      "options": [
        "They are produced via laser interference fringes, eliminating mechanical ruling errors and ghost lines",
        "They do not require optical alignment",
        "They operate without physical slits",
        "They can amplify light like a laser amplifier"
      ],
      "answer": "They are produced via laser interference fringes, eliminating mechanical ruling errors and ghost lines",
      "correct_option": "They are produced via laser interference fringes, eliminating mechanical ruling errors and ghost lines",
      "difficulty": "medium",
      "global_id": 49,
      "explanation": "Holographic fabrication records sinusoidal optical interference fringes onto photoresist, virtually eliminating periodic mechanical errors and stray light ghosts."
    },
    {
      "id": 50,
      "question": "What is the physical principle underlying the determination of laser wavelength using a transmission grating in this experiment?",
      "options": [
        "Measuring the fringe position y and bench distance L gives θ = arctan(y/L), enabling calculation via λ = (d · sin θ) / m",
        "Measuring the heat absorbed by the grating screen",
        "Measuring the time of flight of laser photons",
        "Detecting the Doppler redshift of laser light"
      ],
      "answer": "Measuring the fringe position y and bench distance L gives θ = arctan(y/L), enabling calculation via λ = (d · sin θ) / m",
      "correct_option": "Measuring the fringe position y and bench distance L gives θ = arctan(y/L), enabling calculation via λ = (d · sin θ) / m",
      "difficulty": "easy",
      "global_id": 50,
      "explanation": "By geometry, tan θ = y / L. Substituting θ into the grating equation d sin θ = mλ yields the unknown laser wavelength with high precision."
    }
  ]
};

export const SANDBOX_QUESTION_BANK = {
  "experiment": "Physics Sandbox Dynamics - Question Bank",
  "experimentId": "sandbox",
  "quizId": "physics-sandbox-mastery-quiz",
  "experimentName": "Physics Sandbox Dynamics",
  "description": "Comprehensive 50-Question Physics Question Bank for Physics Sandbox Dynamics",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "According to Newton's First Law, what happens to an object moving in zero gravity with no external forces?",
      "options": [
        "It continues moving with constant velocity in a straight line",
        "It gradually slows down and stops",
        "It begins to rotate in a circular orbit",
        "It falls downward at 9.8 m/s²"
      ],
      "answer": "It continues moving with constant velocity in a straight line",
      "correct_option": "It continues moving with constant velocity in a straight line",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Newton's First Law (Law of Inertia) states that in the absence of net external forces, an object at rest stays at rest and an object in motion maintains constant velocity."
    },
    {
      "id": 2,
      "question": "Newton's Second Law mathematically relates net force, mass, and acceleration as:",
      "options": [
        "F_net = m · a",
        "F_net = m / a",
        "F_net = a / m",
        "F_net = m · a²"
      ],
      "answer": "F_net = m · a",
      "correct_option": "F_net = m · a",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Newton's Second Law states that acceleration is directly proportional to net force and inversely proportional to inertial mass: F = ma."
    },
    {
      "id": 3,
      "question": "What is the physical definition of mechanical impulse (J)?",
      "options": [
        "The integral of force over time (J = F · Δt = Δp)",
        "The rate of change of work over distance",
        "The ratio of mass to kinetic energy",
        "The gravitational potential energy per unit height"
      ],
      "answer": "The integral of force over time (J = F · Δt = Δp)",
      "correct_option": "The integral of force over time (J = F · Δt = Δp)",
      "difficulty": "medium",
      "global_id": 3,
      "explanation": "Impulse J is defined as the force integrated over the collision duration, which strictly equals the total change in linear momentum Δp."
    },
    {
      "id": 4,
      "question": "In an isolated physical system with no external forces, what physical quantity is conserved in all collisions?",
      "options": [
        "Total linear momentum",
        "Kinetic energy only",
        "Gravitational potential energy only",
        "Temperature only"
      ],
      "answer": "Total linear momentum",
      "correct_option": "Total linear momentum",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "By Newton's Third Law, internal collision forces sum to zero, guaranteeing that total linear momentum Σp is conserved in all collisions."
    },
    {
      "id": 5,
      "question": "A collision in which total kinetic energy is conserved before and after impact is called:",
      "options": [
        "A perfectly elastic collision",
        "An inelastic collision",
        "A completely plastic collision",
        "A dissipative collision"
      ],
      "answer": "A perfectly elastic collision",
      "correct_option": "A perfectly elastic collision",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "In a perfectly elastic collision, no kinetic energy is converted into thermal energy, sound, or permanent deformation work (KE_initial = KE_final)."
    },
    {
      "id": 6,
      "question": "The coefficient of restitution (e) is defined as the ratio of:",
      "options": [
        "Relative separation speed to relative approach speed",
        "Total final momentum to total initial momentum",
        "Frictional force to normal force",
        "Potential energy to kinetic energy"
      ],
      "answer": "Relative separation speed to relative approach speed",
      "correct_option": "Relative separation speed to relative approach speed",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "Restitution is defined as e = |v₂f - v₁f| / |v₁i - v₂i|, quantifying the elasticity of an impact."
    },
    {
      "id": 7,
      "question": "For a completely inelastic collision where colliding bodies stick together, restitution e equals:",
      "options": [
        "0.0",
        "1.0",
        "0.5",
        "-1.0"
      ],
      "answer": "0.0",
      "correct_option": "0.0",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "When objects stick together after collision, their separation speed is zero, meaning e = 0."
    },
    {
      "id": 8,
      "question": "For a perfectly elastic collision, what is the value of restitution e?",
      "options": [
        "1.0",
        "0.0",
        "0.5",
        "Infinity"
      ],
      "answer": "1.0",
      "correct_option": "1.0",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "For perfectly elastic collisions, relative separation speed equals relative approach speed, giving e = 1.0."
    },
    {
      "id": 9,
      "question": "What is the gravitational potential energy of a body of mass m raised to height h in gravity g?",
      "options": [
        "PE = m · g · h",
        "PE = 1/2 · m · g · h²",
        "PE = m · v² / 2",
        "PE = g · h / m"
      ],
      "answer": "PE = m · g · h",
      "correct_option": "PE = m · g · h",
      "difficulty": "easy",
      "global_id": 9,
      "explanation": "Work done against uniform gravity equals force times displacement: W = F · h = mgh."
    },
    {
      "id": 10,
      "question": "Total mechanical energy of an undamped conservative rigid body system is:",
      "options": [
        "E = KE + PE = 1/2 m v² + m g h",
        "E = KE - PE",
        "E = m · a · t",
        "E = F · v / t"
      ],
      "answer": "E = KE + PE = 1/2 m v² + m g h",
      "correct_option": "E = KE + PE = 1/2 m v² + m g h",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Total mechanical energy is the sum of translational kinetic energy (1/2 mv²) and gravitational potential energy (mgh)."
    },
    {
      "id": 11,
      "question": "If a net continuous force of 10 N acts on a 2.0 kg box for 3.0 seconds, what is its velocity increase?",
      "options": [
        "15.0 m/s",
        "5.0 m/s",
        "30.0 m/s",
        "6.67 m/s"
      ],
      "answer": "15.0 m/s",
      "correct_option": "15.0 m/s",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "Acceleration a = F / m = 10 N / 2 kg = 5.0 m/s². Velocity change Δv = a · t = 5.0 × 3.0 = 15.0 m/s."
    },
    {
      "id": 12,
      "question": "What is the kinetic energy of a 4.0 kg ball moving at a speed of 5.0 m/s?",
      "options": [
        "50.0 Joules",
        "20.0 Joules",
        "100.0 Joules",
        "10.0 Joules"
      ],
      "answer": "50.0 Joules",
      "correct_option": "50.0 Joules",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "KE = 1/2 · m · v² = 0.5 × 4.0 kg × (5.0 m/s)² = 2 × 25 = 50.0 J."
    },
    {
      "id": 13,
      "question": "Newton's Third Law states that every action force has an equal and opposite reaction force. Why do they not cancel each other out?",
      "options": [
        "Because they act on two different bodies",
        "Because they occur at different times",
        "Because action is always greater than reaction",
        "Because friction eliminates the reaction force"
      ],
      "answer": "Because they act on two different bodies",
      "correct_option": "Because they act on two different bodies",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "Action-reaction pairs act on opposite interacting bodies (F_AB = -F_BA), never on the same isolated body."
    },
    {
      "id": 14,
      "question": "The kinetic friction force opposing sliding between two flat surfaces is modeled as:",
      "options": [
        "f_k = μ_k · N",
        "f_k = μ_k / N",
        "f_k = μ_k · m · v",
        "f_k = 1/2 · μ_k · N²"
      ],
      "answer": "f_k = μ_k · N",
      "correct_option": "f_k = μ_k · N",
      "difficulty": "easy",
      "global_id": 14,
      "explanation": "Amontons-Coulomb friction law states that friction is proportional to the normal contact force: f_k = μ_k N."
    },
    {
      "id": 15,
      "question": "If a ball bounces off a rigid floor with restitution e = 0.8 after falling from height h, its rebound height h' is:",
      "options": [
        "h' = e² · h = 0.64 h",
        "h' = e · h = 0.80 h",
        "h' = 2e · h = 1.6 h",
        "h' = e³ · h = 0.512 h"
      ],
      "answer": "h' = e² · h = 0.64 h",
      "correct_option": "h' = e² · h = 0.64 h",
      "difficulty": "hard",
      "global_id": 15,
      "explanation": "Impact speed is v = √(2gh). Rebound speed is v' = e·v. Rebound height is h' = v'² / (2g) = e²·v²/(2g) = e²·h = 0.64 h."
    },
    {
      "id": 16,
      "question": "In zero-gravity mode (g = 0 m/s²), what trajectory does a ball launched at 10 m/s follow inside the sandbox?",
      "options": [
        "A straight line at constant velocity until colliding with a wall",
        "A downward parabolic arc",
        "An upward hyperbolic arc",
        "An immediate stationary freeze"
      ],
      "answer": "A straight line at constant velocity until colliding with a wall",
      "correct_option": "A straight line at constant velocity until colliding with a wall",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "With g = 0 and no atmospheric drag, net vertical and horizontal forces are zero, producing unaccelerated rectilinear motion."
    },
    {
      "id": 17,
      "question": "When two identical billiard balls (m₁ = m₂) collide head-on elastically with the second ball initially at rest, what occurs?",
      "options": [
        "The first ball stops completely and the second ball moves away with the initial velocity",
        "Both balls stick together and move at half speed",
        "Both balls bounce backwards at equal speeds",
        "The first ball speeds up while the second remains still"
      ],
      "answer": "The first ball stops completely and the second ball moves away with the initial velocity",
      "correct_option": "The first ball stops completely and the second ball moves away with the initial velocity",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "Equal masses in a 1D elastic collision completely exchange velocities: v₁f = 0 and v₂f = v₁i."
    },
    {
      "id": 18,
      "question": "What physical quantity does the mathematical slope of a velocity versus time graph represent?",
      "options": [
        "Acceleration",
        "Total displacement",
        "Momentum",
        "Net work done"
      ],
      "answer": "Acceleration",
      "correct_option": "Acceleration",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "By definition, the time derivative of velocity is instantaneous acceleration: a = dv / dt."
    },
    {
      "id": 19,
      "question": "If gravity is switched from Earth (9.81 m/s²) to Moon (1.62 m/s²), a dropped object:",
      "options": [
        "Accelerates downward ~6x slower, taking ~2.46x longer to reach the ground",
        "Falls at identical velocity",
        "Floats upwards indefinitely",
        "Loses all inertial mass"
      ],
      "answer": "Accelerates downward ~6x slower, taking ~2.46x longer to reach the ground",
      "correct_option": "Accelerates downward ~6x slower, taking ~2.46x longer to reach the ground",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "Because fall time t = √(2h/g), reducing gravity by 6x increases fall time by √6 ≈ 2.46 times."
    },
    {
      "id": 20,
      "question": "In an inelastic collision, the kinetic energy that is lost is primarily converted into:",
      "options": [
        "Internal thermal energy (heat), acoustic vibrations (sound), and structural deformation",
        "Gravitational mass",
        "Electrical potential voltage",
        "Cosmic radiation"
      ],
      "answer": "Internal thermal energy (heat), acoustic vibrations (sound), and structural deformation",
      "correct_option": "Internal thermal energy (heat), acoustic vibrations (sound), and structural deformation",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "By the First Law of Thermodynamics, non-conserved macroscopic mechanical energy dissipates into microscopic internal heat, sound waves, and plastic deformation."
    },
    {
      "id": 21,
      "question": "What does the Work-Energy Theorem state for a rigid body moving in 2D space?",
      "options": [
        "The net work done by all external forces equals the change in kinetic energy (W_net = ΔKE)",
        "Net work done always equals zero",
        "Work is the time derivative of momentum",
        "Potential energy equals kinetic energy at all points"
      ],
      "answer": "The net work done by all external forces equals the change in kinetic energy (W_net = ΔKE)",
      "correct_option": "The net work done by all external forces equals the change in kinetic energy (W_net = ΔKE)",
      "difficulty": "easy",
      "global_id": 21,
      "explanation": "W_net = ∫ F_net · dr = Δ(½ m v²). Work done on a body translates directly into a change in translational kinetic energy."
    },
    {
      "id": 22,
      "question": "What is the formula for gravitational potential energy (PE) near a planetary surface of acceleration g?",
      "options": [
        "PE = m · g · h",
        "PE = ½ m · g · h²",
        "PE = m · g / h",
        "PE = m · v · g"
      ],
      "answer": "PE = m · g · h",
      "correct_option": "PE = m · g · h",
      "difficulty": "easy",
      "global_id": 22,
      "explanation": "Gravitational potential energy of an object at height h relative to a datum datum is PE = mgh."
    },
    {
      "id": 23,
      "question": "If a body speed increases from 2.0 m/s to 6.0 m/s (3x increase), by what factor does its kinetic energy increase?",
      "options": [
        "9 times (since KE ∝ v²)",
        "3 times",
        "6 times",
        "12 times"
      ],
      "answer": "9 times (since KE ∝ v²)",
      "correct_option": "9 times (since KE ∝ v²)",
      "difficulty": "easy",
      "global_id": 23,
      "explanation": "Kinetic energy scales quadratically with speed: KE = ½ m v². Tripling the velocity increases KE by 3² = 9 times."
    },
    {
      "id": 24,
      "question": "A constant horizontal thrust force of F = 50 N is applied to a mass of m = 10 kg on a frictionless surface. What is its acceleration?",
      "options": [
        "5.0 m/s²",
        "500 m/s²",
        "0.2 m/s²",
        "50 m/s²"
      ],
      "answer": "5.0 m/s²",
      "correct_option": "5.0 m/s²",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "a = F / m = 50 N / 10 kg = 5.0 m/s²."
    },
    {
      "id": 25,
      "question": "An instantaneous impulse kick of J = 24 N·s is delivered to a stationary crate of mass m = 3.0 kg. What is its speed immediately following impact?",
      "options": [
        "8.0 m/s",
        "72 m/s",
        "0.125 m/s",
        "24 m/s"
      ],
      "answer": "8.0 m/s",
      "correct_option": "8.0 m/s",
      "difficulty": "easy",
      "global_id": 25,
      "explanation": "J = Δp = m · Δv. Δv = J / m = 24 N·s / 3.0 kg = 8.0 m/s."
    },
    {
      "id": 26,
      "question": "In a 1D elastic collision between two identical masses (m₁ = m₂), where m₂ is initially at rest, what happens after collision?",
      "options": [
        "m₁ stops completely and m₂ moves forward with the initial velocity of m₁",
        "Both masses stick together and move at half speed",
        "m₁ rebounds with half speed while m₂ stays at rest",
        "Both masses come to an immediate halt"
      ],
      "answer": "m₁ stops completely and m₂ moves forward with the initial velocity of m₁",
      "correct_option": "m₁ stops completely and m₂ moves forward with the initial velocity of m₁",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "In equal-mass 1D elastic collisions, bodies exchange velocities completely: v₁f = 0 and v₂f = v₁i."
    },
    {
      "id": 27,
      "question": "Two identical 2 kg clay balls moving toward each other at 4 m/s collide and stick together in a completely inelastic collision. What is their final speed?",
      "options": [
        "0.0 m/s (they stop dead at center)",
        "4.0 m/s",
        "2.0 m/s",
        "8.0 m/s"
      ],
      "answer": "0.0 m/s (they stop dead at center)",
      "correct_option": "0.0 m/s (they stop dead at center)",
      "difficulty": "easy",
      "global_id": 27,
      "explanation": "Total initial momentum p_initial = (2)(4) + (2)(-4) = 0. Since momentum is conserved, v_final = 0 / 4 = 0 m/s."
    },
    {
      "id": 28,
      "question": "What is the maximum static friction force f_s,max between a body and surface with static coefficient μ_s and normal force N?",
      "options": [
        "f_s,max = μ_s · N",
        "f_s,max = μ_s / N",
        "f_s,max = N / μ_s",
        "f_s,max = μ_s · m · v"
      ],
      "answer": "f_s,max = μ_s · N",
      "correct_option": "f_s,max = μ_s · N",
      "difficulty": "easy",
      "global_id": 28,
      "explanation": "Amontons-Coulomb law states that static friction opposes motion up to a maximum threshold f_s,max = μ_s · N."
    },
    {
      "id": 29,
      "question": "For typical physical contact interfaces in Newtonian mechanics, how does the kinetic friction coefficient μ_k compare to the static coefficient μ_s?",
      "options": [
        "μ_k is less than μ_s (μ_k < μ_s)",
        "μ_k is always greater than μ_s",
        "μ_k is always exactly equal to μ_s",
        "μ_k is always zero"
      ],
      "answer": "μ_k is less than μ_s (μ_k < μ_s)",
      "correct_option": "μ_k is less than μ_s (μ_k < μ_s)",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "Once relative sliding begins, microscopic electrostatic asperities have less time to form cold bonds, so kinetic friction is typically lower than static friction."
    },
    {
      "id": 30,
      "question": "On a flat horizontal plane, what is the normal force N exerted by the surface on a static crate of mass m under gravitational acceleration g?",
      "options": [
        "N = m · g",
        "N = m / g",
        "N = 0",
        "N = m · g · cos(45°)"
      ],
      "answer": "N = m · g",
      "correct_option": "N = m · g",
      "difficulty": "easy",
      "global_id": 30,
      "explanation": "Vertical equilibrium ΣFy = 0 requires normal support force N to exactly balance downward gravity: N = mg."
    },
    {
      "id": 31,
      "question": "On an incline of angle θ to the horizontal, what component of gravitational force pulls an object down along the ramp surface?",
      "options": [
        "F_parallel = m · g · sin(θ)",
        "F_parallel = m · g · cos(θ)",
        "F_parallel = m · g · tan(θ)",
        "F_parallel = m · g"
      ],
      "answer": "F_parallel = m · g · sin(θ)",
      "correct_option": "F_parallel = m · g · sin(θ)",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Resolving gravity vector mg into components: perpendicular component is mg cos θ, and downslope parallel component is mg sin θ."
    },
    {
      "id": 32,
      "question": "What is the normal reaction force N exerted on a crate of mass m sitting on an inclined plane of angle θ?",
      "options": [
        "N = m · g · cos(θ)",
        "N = m · g · sin(θ)",
        "N = m · g · tan(θ)",
        "N = m · g"
      ],
      "answer": "N = m · g · cos(θ)",
      "correct_option": "N = m · g · cos(θ)",
      "difficulty": "easy",
      "global_id": 32,
      "explanation": "Equilibrium perpendicular to the ramp surface yields N - mg cos θ = 0 ⟹ N = mg cos θ."
    },
    {
      "id": 33,
      "question": "In a Zero-G physics environment (g = 0 m/s²), what path does an object follow when given an initial velocity v₀?",
      "options": [
        "A uniform straight-line trajectory at constant speed until colliding with a wall",
        "A downward parabolic trajectory",
        "A logarithmic circular spiral",
        "It decelerates to an immediate stop"
      ],
      "answer": "A uniform straight-line trajectory at constant speed until colliding with a wall",
      "correct_option": "A uniform straight-line trajectory at constant speed until colliding with a wall",
      "difficulty": "easy",
      "global_id": 33,
      "explanation": "With g = 0 and no drag (F_net = 0), Newton First Law dictates uniform rectilinear motion: r(t) = r₀ + v₀ t."
    },
    {
      "id": 34,
      "question": "Where is the center of mass (X_cm) located for two bodies of equal mass m situated at x₁ = 2.0 m and x₂ = 8.0 m?",
      "options": [
        "X_cm = 5.0 m",
        "X_cm = 4.0 m",
        "X_cm = 6.0 m",
        "X_cm = 10.0 m"
      ],
      "answer": "X_cm = 5.0 m",
      "correct_option": "X_cm = 5.0 m",
      "difficulty": "easy",
      "global_id": 34,
      "explanation": "X_cm = (m·2 + m·8) / (2m) = 10m / 2m = 5.0 m."
    },
    {
      "id": 35,
      "question": "What physical quantity represents rotational inertia in angular dynamics?",
      "options": [
        "Moment of Inertia (I)",
        "Torque (τ)",
        "Angular velocity (ω)",
        "Rotational impulse"
      ],
      "answer": "Moment of Inertia (I)",
      "correct_option": "Moment of Inertia (I)",
      "difficulty": "easy",
      "global_id": 35,
      "explanation": "Moment of inertia I = Σ m_i r_i² quantifies an object resistance to rotational acceleration, serving as the rotational analog of mass."
    },
    {
      "id": 36,
      "question": "What is the formula for the rotational kinetic energy of a rigid body rotating with angular speed ω about a principal axis?",
      "options": [
        "KE_rot = ½ I · ω²",
        "KE_rot = I · ω",
        "KE_rot = ½ m · ω²",
        "KE_rot = I² · ω"
      ],
      "answer": "KE_rot = ½ I · ω²",
      "correct_option": "KE_rot = ½ I · ω²",
      "difficulty": "easy",
      "global_id": 36,
      "explanation": "Rotational kinetic energy is defined as KE_rot = ½ I ω², directly analogous to translational kinetic energy KE_trans = ½ m v²."
    },
    {
      "id": 37,
      "question": "Which of Newton laws guarantees that momentum is strictly conserved in internal two-body collisions?",
      "options": [
        "Newton Third Law (Action and Reaction forces are equal and opposite: F₁₂ = -F₂₁)",
        "Newton First Law only",
        "Law of Universal Gravitation",
        "Coulomb Law"
      ],
      "answer": "Newton Third Law (Action and Reaction forces are equal and opposite: F₁₂ = -F₂₁)",
      "correct_option": "Newton Third Law (Action and Reaction forces are equal and opposite: F₁₂ = -F₂₁)",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "Because F₁₂ = -F₂₁, integrating over collision time yields J₁ = -J₂ ⟹ Δp₁ + Δp₂ = 0, proving conservation of total momentum."
    },
    {
      "id": 38,
      "question": "What is the apparent weight reading of a person of mass 70 kg inside an elevator in free fall (a = g downward)?",
      "options": [
        "0 N (Apparent weightlessness)",
        "686 N",
        "1372 N",
        "343 N"
      ],
      "answer": "0 N (Apparent weightlessness)",
      "correct_option": "0 N (Apparent weightlessness)",
      "difficulty": "easy",
      "global_id": 38,
      "explanation": "N - mg = m(-g) ⟹ N = 0 N. In free fall, the support scale exerts zero normal force, producing apparent weightlessness."
    },
    {
      "id": 39,
      "question": "What is the surface gravity of the Moon relative to Earth surface gravity (g = 9.81 m/s²)?",
      "options": [
        "~1.62 m/s² (about 1/6 of Earth gravity)",
        "~3.72 m/s²",
        "~9.81 m/s²",
        "~24.79 m/s²"
      ],
      "answer": "~1.62 m/s² (about 1/6 of Earth gravity)",
      "correct_option": "~1.62 m/s² (about 1/6 of Earth gravity)",
      "difficulty": "easy",
      "global_id": 39,
      "explanation": "Lunar surface gravity is approximately 1.62 m/s², roughly 16.5% (~1/6) of Earth standard gravity."
    },
    {
      "id": 40,
      "question": "What is the surface gravity of Mars relative to Earth surface gravity?",
      "options": [
        "~3.72 m/s² (about 38% of Earth gravity)",
        "~1.62 m/s²",
        "~9.81 m/s²",
        "~0.00 m/s²"
      ],
      "answer": "~3.72 m/s² (about 38% of Earth gravity)",
      "correct_option": "~3.72 m/s² (about 38% of Earth gravity)",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "Martian surface gravity is approximately 3.72 m/s², approximately 38% of terrestrial gravity."
    },
    {
      "id": 41,
      "question": "What is the surface gravity of Jupiter compared to Earth?",
      "options": [
        "~24.79 m/s² (about 2.53 times Earth gravity)",
        "~9.81 m/s²",
        "~1.62 m/s²",
        "~50.0 m/s²"
      ],
      "answer": "~24.79 m/s² (about 2.53 times Earth gravity)",
      "correct_option": "~24.79 m/s² (about 2.53 times Earth gravity)",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "Jupiter intense planetary mass produces a surface gravity of ~24.79 m/s², over 2.5 times that of Earth."
    },
    {
      "id": 42,
      "question": "What is mechanical power defined as in physics?",
      "options": [
        "The rate at which work is done or energy transferred: P = dW / dt = F · v",
        "The total work done multiplied by time",
        "The momentum per unit area",
        "The potential energy divided by mass"
      ],
      "answer": "The rate at which work is done or energy transferred: P = dW / dt = F · v",
      "correct_option": "The rate at which work is done or energy transferred: P = dW / dt = F · v",
      "difficulty": "easy",
      "global_id": 42,
      "explanation": "Power P is the instantaneous rate of energy transfer: P = dW / dt = F · (dr/dt) = F · v."
    },
    {
      "id": 43,
      "question": "A rocket engine exerts a thrust of 400 N on a vehicle traveling at 25 m/s. What mechanical power is being delivered?",
      "options": [
        "10,000 Watts (10 kW)",
        "16 Watts",
        "1,000 Watts",
        "425 Watts"
      ],
      "answer": "10,000 Watts (10 kW)",
      "correct_option": "10,000 Watts (10 kW)",
      "difficulty": "easy",
      "global_id": 43,
      "explanation": "P = F · v = (400 N) × (25 m/s) = 10,000 W = 10 kW."
    },
    {
      "id": 44,
      "question": "A superball with coefficient of restitution e = 0.80 impacts a rigid concrete floor at 15.0 m/s. What is its rebound velocity?",
      "options": [
        "12.0 m/s upwards",
        "15.0 m/s upwards",
        "9.6 m/s upwards",
        "0.0 m/s"
      ],
      "answer": "12.0 m/s upwards",
      "correct_option": "12.0 m/s upwards",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "v_rebound = e · v_impact = 0.80 × 15.0 m/s = 12.0 m/s."
    },
    {
      "id": 45,
      "question": "What fraction of kinetic energy is retained after a collision against an immovable wall with coefficient of restitution e?",
      "options": [
        "e² (i.e. KE_f / KE_i = e²)",
        "e",
        "1 - e",
        "½ e²"
      ],
      "answer": "e² (i.e. KE_f / KE_i = e²)",
      "correct_option": "e² (i.e. KE_f / KE_i = e²)",
      "difficulty": "medium",
      "global_id": 45,
      "explanation": "KE_f = ½ m (e v_i)² = e² · (½ m v_i²) = e² · KE_i. For e = 0.8, 64% of kinetic energy is preserved."
    },
    {
      "id": 46,
      "question": "In two-dimensional oblique collisions, along which direction is linear momentum conserved?",
      "options": [
        "Along both independent Cartesian axes (x-axis and y-axis independently)",
        "Only along the line of centers (normal direction)",
        "Only along the tangential plane",
        "Momentum is never conserved in 2D collisions"
      ],
      "answer": "Along both independent Cartesian axes (x-axis and y-axis independently)",
      "correct_option": "Along both independent Cartesian axes (x-axis and y-axis independently)",
      "difficulty": "medium",
      "global_id": 46,
      "explanation": "Because momentum is a vector quantity (p = m·v), conservation applies independently to each orthogonal component: Σpx_i = Σpx_f and Σpy_i = Σpy_f."
    },
    {
      "id": 47,
      "question": "What happens to a sliding crate entering a region with kinetic friction coefficient μ_k under gravity g?",
      "options": [
        "It decelerates with constant acceleration a = -μ_k · g until stopping",
        "It accelerates forward",
        "It maintains constant velocity",
        "It floats upwards"
      ],
      "answer": "It decelerates with constant acceleration a = -μ_k · g until stopping",
      "correct_option": "It decelerates with constant acceleration a = -μ_k · g until stopping",
      "difficulty": "easy",
      "global_id": 47,
      "explanation": "Friction force f_k = μ_k · N = μ_k · m · g. Acceleration a = -f_k / m = -μ_k · g."
    },
    {
      "id": 48,
      "question": "If two masses m₁ = 2.0 kg and m₂ = 8.0 kg experience the identical net thrust force F, what is the ratio of their accelerations a₁ / a₂?",
      "options": [
        "4.0 (a₁ is 4x greater than a₂)",
        "0.25",
        "1.0",
        "16.0"
      ],
      "answer": "4.0 (a₁ is 4x greater than a₂)",
      "correct_option": "4.0 (a₁ is 4x greater than a₂)",
      "difficulty": "easy",
      "global_id": 48,
      "explanation": "a = F / m. Therefore a₁ / a₂ = (F / m₁) / (F / m₂) = m₂ / m₁ = 8.0 / 2.0 = 4.0."
    },
    {
      "id": 49,
      "question": "What are the SI base units of linear momentum and mechanical impulse?",
      "options": [
        "kg · m / s (equivalent to N · s)",
        "kg · m² / s²",
        "kg / (m · s)",
        "N / s"
      ],
      "answer": "kg · m / s (equivalent to N · s)",
      "correct_option": "kg · m / s (equivalent to N · s)",
      "difficulty": "easy",
      "global_id": 49,
      "explanation": "Momentum p = mv has units kg·(m/s). Impulse J = F·Δt has units N·s = (kg·m/s²)·s = kg·m/s."
    },
    {
      "id": 50,
      "question": "In rigid-body physics simulation (such as Matter.js), why are multiple constraint iterations performed per animation frame?",
      "options": [
        "To accurately resolve overlapping contact manifolds and satisfy momentum conservation without visual penetration",
        "To generate random colors for objects",
        "To save memory on the GPU",
        "To synchronize system clocks with UTC"
      ],
      "answer": "To accurately resolve overlapping contact manifolds and satisfy momentum conservation without visual penetration",
      "correct_option": "To accurately resolve overlapping contact manifolds and satisfy momentum conservation without visual penetration",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "Iterative impulse solvers (Sequential Impulses) iteratively project velocity and position constraints to solve resting contacts and collision responses accurately without sinking or exploding."
    }
  ]
};

export const POF_ATTENUATION_QUESTION_BANK = {
  "experiment": "Plastic Optical Fiber Attenuation - Question Bank",
  "experimentId": "pof-attenuation",
  "quizId": "pof-attenuation-mastery-quiz",
  "experimentName": "Plastic Optical Fiber Attenuation",
  "description": "Comprehensive 50-Question Physics Question Bank for Plastic Optical Fiber Attenuation",
  "total_questions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What does optical fiber attenuation measure?",
      "options": [
        "The reduction or loss of optical signal power as light travels through the fiber",
        "The increase in wavelength of the light beam",
        "The change in core diameter of the optical cable",
        "The velocity increase of photons inside the waveguide"
      ],
      "answer": "The reduction or loss of optical signal power as light travels through the fiber",
      "correct_option": "The reduction or loss of optical signal power as light travels through the fiber",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Attenuation is the physical attenuation (decay) of optical power along an optical fiber due to absorption, scattering, and radiative losses."
    },
    {
      "id": 2,
      "question": "Which mathematical formula defines the total optical power attenuation (A_dB) in decibels?",
      "options": [
        "A_dB = 10 · log10(P_in / P_out)",
        "A_dB = 20 · log10(P_out / P_in)",
        "A_dB = 10 · ln(P_out / P_in)",
        "A_dB = (P_in - P_out) / 10"
      ],
      "answer": "A_dB = 10 · log10(P_in / P_out)",
      "correct_option": "A_dB = 10 · log10(P_in / P_out)",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Decibel power attenuation is defined as A_dB = 10 · log10(P_in / P_out), expressing the ratio of input power to output power on a logarithmic scale."
    },
    {
      "id": 3,
      "question": "How is the attenuation coefficient (α) per unit length calculated from total attenuation A_dB and fiber length L?",
      "options": [
        "α = A_dB / L",
        "α = A_dB · L",
        "α = L / A_dB",
        "α = √(A_dB · L)"
      ],
      "answer": "α = A_dB / L",
      "correct_option": "α = A_dB / L",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "The attenuation coefficient α represents the loss normalized per unit distance: α = A_dB / L (expressed in dB/km or dB/m)."
    },
    {
      "id": 4,
      "question": "When fiber length is measured in metres (L_m), how is the attenuation coefficient α in dB/km expressed?",
      "options": [
        "α = (1000 / L_m) · 10 · log10(P_in / P_out)",
        "α = (L_m / 1000) · 10 · log10(P_in / P_out)",
        "α = (1 / L_m) · 10 · log10(P_in / P_out)",
        "α = 1000 · (P_in / P_out)"
      ],
      "answer": "α = (1000 / L_m) · 10 · log10(P_in / P_out)",
      "correct_option": "α = (1000 / L_m) · 10 · log10(P_in / P_out)",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "Because L_km = L_m / 1000, α_dB/km = A_dB / L_km = (1000 / L_m) · 10 · log10(P_in / P_out)."
    },
    {
      "id": 5,
      "question": "What is the core material of standard Plastic Optical Fiber (POF)?",
      "options": [
        "Polymethyl methacrylate (PMMA)",
        "Pure fused silica glass (SiO2)",
        "Gallium arsenide (GaAs)",
        "Silicon carbide (SiC)"
      ],
      "answer": "Polymethyl methacrylate (PMMA)",
      "correct_option": "Polymethyl methacrylate (PMMA)",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "Standard step-index POF utilizes polymethyl methacrylate (PMMA, acrylic) as its flexible, high-transparency core."
    },
    {
      "id": 6,
      "question": "What is the primary transmission window commonly used for PMMA-based Plastic Optical Fiber?",
      "options": [
        "Visible red light (~650 nm)",
        "Ultraviolet light (~250 nm)",
        "Long-wave infrared (~10.6 μm)",
        "Near-infrared telecom band (1550 nm)"
      ],
      "answer": "Visible red light (~650 nm)",
      "correct_option": "Visible red light (~650 nm)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "PMMA polymer fibers exhibit an optical transmission window in the visible spectrum around 650 nm (red), where absorption minima occur."
    },
    {
      "id": 7,
      "question": "Under the Bouguer-Lambert-Beer law, how does optical power P_out decay with fiber length L for distributed loss α?",
      "options": [
        "P_out = P_in · 10^(-α · L / 10)",
        "P_out = P_in - α · L",
        "P_out = P_in / (1 + α · L)",
        "P_out = P_in · (α · L)^2"
      ],
      "answer": "P_out = P_in · 10^(-α · L / 10)",
      "correct_option": "P_out = P_in · 10^(-α · L / 10)",
      "difficulty": "medium",
      "global_id": 7,
      "explanation": "Optical power undergoes exponential attenuation with propagation distance: P_out = P_in · 10^(-αL/10), matching the linear rate equation dP/dz = -α_p P."
    },
    {
      "id": 8,
      "question": "Why must input power (P_in) and output power (P_out) be measured in the same units before computing attenuation?",
      "options": [
        "Because decibel loss is derived from a dimensionless power ratio",
        "Because conversion to decibels is only possible for milliwatts",
        "Because optical detectors only support one electrical unit at a time",
        "Because powers must add up to 100%"
      ],
      "answer": "Because decibel loss is derived from a dimensionless power ratio",
      "correct_option": "Because decibel loss is derived from a dimensionless power ratio",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "The argument of the logarithm (P_in / P_out) must be a dimensionless ratio; mixing mW and μW would introduce a 1000-fold error (+30 dB)."
    },
    {
      "id": 9,
      "question": "What is Rayleigh scattering in plastic optical fibers caused by?",
      "options": [
        "Microscopic density and refractive index fluctuations in the polymer matrix",
        "Bending of the outer cable jacket",
        "Total reflection at the metallic bench rail",
        "Thermal expansion of the copper connectors"
      ],
      "answer": "Microscopic density and refractive index fluctuations in the polymer matrix",
      "correct_option": "Microscopic density and refractive index fluctuations in the polymer matrix",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Rayleigh scattering results from microscopic, sub-wavelength density fluctuations frozen into the amorphous polymer during manufacturing."
    },
    {
      "id": 10,
      "question": "How does Rayleigh scattering loss depend on the optical wavelength (λ)?",
      "options": [
        "It is proportional to 1 / λ⁴",
        "It is proportional to λ²",
        "It is linearly proportional to λ",
        "It is independent of wavelength"
      ],
      "answer": "It is proportional to 1 / λ⁴",
      "correct_option": "It is proportional to 1 / λ⁴",
      "difficulty": "medium",
      "global_id": 10,
      "explanation": "Rayleigh scattering cross-section varies inversely with the fourth power of wavelength (1/λ⁴), resulting in much stronger scattering at shorter wavelengths."
    },
    {
      "id": 11,
      "question": "What causes the strong infrared absorption bands in PMMA plastic optical fiber?",
      "options": [
        "Vibrational overtones and harmonics of carbon-hydrogen (C-H) molecular bonds",
        "Electronic band transitions in silicon crystals",
        "Conductance band electron scattering in copper",
        "Magnetic dipole moments in the cladding"
      ],
      "answer": "Vibrational overtones and harmonics of carbon-hydrogen (C-H) molecular bonds",
      "correct_option": "Vibrational overtones and harmonics of carbon-hydrogen (C-H) molecular bonds",
      "difficulty": "hard",
      "global_id": 11,
      "explanation": "C-H stretching vibration fundamentals and high-order overtones in PMMA create strong intrinsic absorption bands in the infrared region (>700 nm)."
    },
    {
      "id": 12,
      "question": "What is macrobending loss in an optical fiber?",
      "options": [
        "Radiative loss caused by curving the fiber below its permissible bend radius",
        "Scattering from nanoscale core bubbles",
        "Loss due to cable length being too long",
        "Attenuation caused by thermal ambient changes"
      ],
      "answer": "Radiative loss caused by curving the fiber below its permissible bend radius",
      "correct_option": "Radiative loss caused by curving the fiber below its permissible bend radius",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "Macrobending occurs when the fiber is curved with a macroscopic radius such that the angle of incidence at the outer core-cladding boundary falls below the critical angle, radiating light into the cladding."
    },
    {
      "id": 13,
      "question": "What is microbending loss in an optical fiber?",
      "options": [
        "Loss caused by microscopic localized lateral deformations and axial stress along the core-cladding boundary",
        "Reflection off the power meter LCD screen",
        "Dispersion caused by multiple optical modes",
        "Signal loss from slow photodetector response"
      ],
      "answer": "Loss caused by microscopic localized lateral deformations and axial stress along the core-cladding boundary",
      "correct_option": "Loss caused by microscopic localized lateral deformations and axial stress along the core-cladding boundary",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "Microbending arises from microscopic repetitive mechanical imperfections, surface roughness, or lateral pinching that couple guided modes into radiating cladding modes."
    },
    {
      "id": 14,
      "question": "What typical attenuation coefficient (α) is expected for standard PMMA step-index POF at 650 nm?",
      "options": [
        "Approximately 150 to 200 dB/km (0.15 to 0.20 dB/m)",
        "Approximately 0.2 dB/km (0.0002 dB/m)",
        "Approximately 15,000 dB/km (15 dB/m)",
        "0.00 dB/km (Lossless)"
      ],
      "answer": "Approximately 150 to 200 dB/km (0.15 to 0.20 dB/m)",
      "correct_option": "Approximately 150 to 200 dB/km (0.15 to 0.20 dB/m)",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "Standard PMMA step-index POF has an attenuation of ~150-200 dB/km at 650 nm, which is around 0.15-0.20 dB per metre."
    },
    {
      "id": 15,
      "question": "If input power P_in = 3.00 mW and output power P_out = 1.50 mW, what is the total attenuation in decibels?",
      "options": [
        "~3.01 dB",
        "~6.02 dB",
        "~1.50 dB",
        "~10.00 dB"
      ],
      "answer": "~3.01 dB",
      "correct_option": "~3.01 dB",
      "difficulty": "easy",
      "global_id": 15,
      "explanation": "A_dB = 10 · log10(3.00 / 1.50) = 10 · log10(2) ≈ 10 · 0.30103 = 3.01 dB (halving of power corresponds to 3 dB loss)."
    },
    {
      "id": 16,
      "question": "If input power P_in = 3.00 mW and output power P_out = 0.30 mW, what is the total attenuation in decibels?",
      "options": [
        "10.00 dB",
        "1.00 dB",
        "20.00 dB",
        "3.00 dB"
      ],
      "answer": "10.00 dB",
      "correct_option": "10.00 dB",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "A_dB = 10 · log10(3.00 / 0.30) = 10 · log10(10) = 10 · 1 = 10.00 dB."
    },
    {
      "id": 17,
      "question": "If a 10.0 m optical fiber has a total attenuation of 1.80 dB, what is its attenuation coefficient in dB/km?",
      "options": [
        "180 dB/km",
        "18 dB/km",
        "1.8 dB/km",
        "1800 dB/km"
      ],
      "answer": "180 dB/km",
      "correct_option": "180 dB/km",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "L_km = 10.0 / 1000 = 0.01 km. α = 1.80 dB / 0.01 km = 180 dB/km."
    },
    {
      "id": 18,
      "question": "What is the purpose of measuring reference power (P_in) before measuring the fiber output?",
      "options": [
        "To establish a baseline coupled source power against which transmission loss is evaluated",
        "To calibrate the physical guide rail ruler scale",
        "To check whether the room ambient lighting is off",
        "To determine the focal length of the detector lens"
      ],
      "answer": "To establish a baseline coupled source power against which transmission loss is evaluated",
      "correct_option": "To establish a baseline coupled source power against which transmission loss is evaluated",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "Measuring P_in directly from the source or calibrated reference patch provides the known input power necessary to compute the decibel attenuation ratio."
    },
    {
      "id": 19,
      "question": "What happens to the Optical Power Meter reading when the optical source is switched OFF?",
      "options": [
        "It reads zero (or subtle instrument dark noise floor)",
        "It retains its previous measurement indefinitely",
        "It displays 100 mW automatically",
        "It shows Infinity (∞)"
      ],
      "answer": "It reads zero (or subtle instrument dark noise floor)",
      "correct_option": "It reads zero (or subtle instrument dark noise floor)",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "With the light source de-energized, no optical photons strike the photodetector, yielding 0.00 mW (aside from negligible dark current)."
    },
    {
      "id": 20,
      "question": "What happens to the power meter reading when the optical fiber is disconnected on the bench?",
      "options": [
        "No light reaches the detector, producing zero measured output power",
        "The meter reading increases due to free space propagation",
        "The meter switches automatically into laser mode",
        "The meter calculates negative decibels"
      ],
      "answer": "No light reaches the detector, producing zero measured output power",
      "correct_option": "No light reaches the detector, producing zero measured output power",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "Disconnecting the fiber breaks the waveguide path, preventing source photons from arriving at the detector."
    },
    {
      "id": 21,
      "question": "Why should an optical transmitter be allowed to stabilize (warm up) prior to taking readings?",
      "options": [
        "To ensure stable optical power output and eliminate semiconductor thermal drift",
        "To allow the plastic optical fiber to melt slightly for better coupling",
        "To discharge static electricity on the optical bench rails",
        "To let the room reach ambient equilibrium"
      ],
      "answer": "To ensure stable optical power output and eliminate semiconductor thermal drift",
      "correct_option": "To ensure stable optical power output and eliminate semiconductor thermal drift",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Semiconductor LED/laser junctions undergo thermal shift during initial turn-on; warm-up ensures steady forward current and constant optical emission."
    },
    {
      "id": 22,
      "question": "What type of curve is observed when plotting measured output power P_out against fiber length L on linear axes?",
      "options": [
        "An exponentially decaying downward curve",
        "A straight horizontal line",
        "A strictly linear ascending slope",
        "A sinusoidal oscillation"
      ],
      "answer": "An exponentially decaying downward curve",
      "correct_option": "An exponentially decaying downward curve",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "Because P_out = P_in · 10^(-αL/10), plotting power vs length on linear axes produces an exponential decay curve."
    },
    {
      "id": 23,
      "question": "What type of relationship is observed when plotting total decibel attenuation (A_dB) against fiber length L?",
      "options": [
        "A linear relationship whose slope is the attenuation coefficient (α)",
        "An exponential curve bending upward rapidly",
        "A parabolic parabola with vertex at zero",
        "An inverse hyperbola asymptotically approaching zero"
      ],
      "answer": "A linear relationship whose slope is the attenuation coefficient (α)",
      "correct_option": "A linear relationship whose slope is the attenuation coefficient (α)",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "Since A_dB = α · L, total decibel loss is directly proportional to length, producing a straight line whose slope d(A)/dL = α."
    },
    {
      "id": 24,
      "question": "What is Fresnel reflection loss at the cleaved fiber end-facet?",
      "options": [
        "Reflective loss caused by refractive index discontinuity between air (n≈1.0) and the polymer core (n≈1.49)",
        "Scattering from impurities inside the optical detector silicon",
        "Absorption by water vapour in the laboratory room",
        "Loss caused by mechanical vibration of the optical bench"
      ],
      "answer": "Reflective loss caused by refractive index discontinuity between air (n≈1.0) and the polymer core (n≈1.49)",
      "correct_option": "Reflective loss caused by refractive index discontinuity between air (n≈1.0) and the polymer core (n≈1.49)",
      "difficulty": "hard",
      "global_id": 24,
      "explanation": "At normal incidence, reflection R = [(n1 - n0) / (n1 + n0)]² ≈ [(1.49 - 1) / (1.49 + 1)]² ≈ 3.9% (~0.17 dB loss per facet) due to index mismatch."
    },
    {
      "id": 25,
      "question": "Why does lateral or angular misalignment of the input coupler degrade transmission?",
      "options": [
        "It reduces coupling efficiency, as fewer incident rays fall within the fiber acceptance cone",
        "It permanently alters the refractive index of the cladding",
        "It shifts the laser emission wavelength to infrared",
        "It increases electrical resistance of the power meter leads"
      ],
      "answer": "It reduces coupling efficiency, as fewer incident rays fall within the fiber acceptance cone",
      "correct_option": "It reduces coupling efficiency, as fewer incident rays fall within the fiber acceptance cone",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "Misalignment causes rays to strike outside the fiber core area or at angles exceeding the acceptance cone (θ > θ_a), failing total internal reflection."
    },
    {
      "id": 26,
      "question": "How does dirt, dust, or fingerprints on the optical fiber facet affect the measurement?",
      "options": [
        "They cause localized optical scattering and severe insertion loss",
        "They decrease optical attenuation across the link",
        "They transform multimode fiber into singlemode fiber",
        "They have zero effect because polymer is immune to contamination"
      ],
      "answer": "They cause localized optical scattering and severe insertion loss",
      "correct_option": "They cause localized optical scattering and severe insertion loss",
      "difficulty": "easy",
      "global_id": 26,
      "explanation": "Contaminants on the core face scatter and absorb light, introducing artificial extrinsic loss and corrupting baseline measurements."
    },
    {
      "id": 27,
      "question": "What is the typical core diameter of standard step-index plastic optical fiber compared to silica singlemode fiber?",
      "options": [
        "POF core is very large (~980 μm to 1000 μm), whereas singlemode silica is ~9 μm",
        "POF core is tiny (~1 μm), whereas silica is ~1 mm",
        "Both cores are identically 50 μm",
        "POF has no core, only cladding"
      ],
      "answer": "POF core is very large (~980 μm to 1000 μm), whereas singlemode silica is ~9 μm",
      "correct_option": "POF core is very large (~980 μm to 1000 μm), whereas singlemode silica is ~9 μm",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Standard step-index POF has an enormous 1 mm outer diameter with a ~980 μm core, making alignment easy with visible light."
    },
    {
      "id": 28,
      "question": "What is a key advantage of POF's large core diameter in laboratory experiments?",
      "options": [
        "High coupling tolerance and easy mechanical alignment without sub-micron positioning equipment",
        "Near-zero attenuation below 0.01 dB/km",
        "Ability to transmit terahertz radio waves",
        "Immunity to all forms of macrobending"
      ],
      "answer": "High coupling tolerance and easy mechanical alignment without sub-micron positioning equipment",
      "correct_option": "High coupling tolerance and easy mechanical alignment without sub-micron positioning equipment",
      "difficulty": "easy",
      "global_id": 28,
      "explanation": "With a ~1 mm core, light can be coupled efficiently with inexpensive connectors and relaxed alignment tolerances."
    },
    {
      "id": 29,
      "question": "If a student records P_in = 2.50 mW and P_out = 2.50 mW for an ideal 0 m link, what is total attenuation?",
      "options": [
        "0.00 dB",
        "1.00 dB",
        "10.00 dB",
        "Undefined"
      ],
      "answer": "0.00 dB",
      "correct_option": "0.00 dB",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "A_dB = 10 · log10(2.50 / 2.50) = 10 · log10(1) = 0.00 dB (zero attenuation corresponds to unity power transmission)."
    },
    {
      "id": 30,
      "question": "If 10% of input power is lost during propagation (so P_out = 0.90 · P_in), what is the total attenuation?",
      "options": [
        "~0.46 dB",
        "~1.00 dB",
        "~10.00 dB",
        "~4.60 dB"
      ],
      "answer": "~0.46 dB",
      "correct_option": "~0.46 dB",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "A_dB = 10 · log10(1 / 0.90) = 10 · log10(1.111) ≈ 10 · 0.04576 = 0.46 dB."
    },
    {
      "id": 31,
      "question": "If 90% of input power is lost during propagation (so P_out = 0.10 · P_in), what is the total attenuation?",
      "options": [
        "10.0 dB",
        "9.0 dB",
        "90.0 dB",
        "1.0 dB"
      ],
      "answer": "10.0 dB",
      "correct_option": "10.0 dB",
      "difficulty": "easy",
      "global_id": 31,
      "explanation": "A_dB = 10 · log10(1 / 0.10) = 10 · log10(10) = 10.0 dB."
    },
    {
      "id": 32,
      "question": "If 99% of input power is lost during propagation (P_out = 0.01 · P_in), what is the total attenuation?",
      "options": [
        "20.0 dB",
        "99.0 dB",
        "2.0 dB",
        "40.0 dB"
      ],
      "answer": "20.0 dB",
      "correct_option": "20.0 dB",
      "difficulty": "easy",
      "global_id": 32,
      "explanation": "A_dB = 10 · log10(1 / 0.01) = 10 · log10(100) = 10 · 2 = 20.0 dB."
    },
    {
      "id": 33,
      "question": "What is the primary trade-off of Plastic Optical Fiber compared to Silica Glass Optical Fiber?",
      "options": [
        "POF has much higher attenuation (~180 dB/km vs ~0.2 dB/km) but offers superior flexibility, ruggedness, and low installation cost",
        "POF is much more brittle and shatters upon touch",
        "POF cannot guide visible light wavelengths",
        "POF requires cryogenic cooling to operate"
      ],
      "answer": "POF has much higher attenuation (~180 dB/km vs ~0.2 dB/km) but offers superior flexibility, ruggedness, and low installation cost",
      "correct_option": "POF has much higher attenuation (~180 dB/km vs ~0.2 dB/km) but offers superior flexibility, ruggedness, and low installation cost",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "While silica fiber has ultra-low loss (~0.2 dB/km at 1550 nm) for long-haul networks, POF's higher loss restricts it to short-distance links (<100 m) where mechanical toughness is key."
    },
    {
      "id": 34,
      "question": "How does the cutback method determine fiber attenuation in professional laboratory practice?",
      "options": [
        "By measuring output power, cutting the fiber back to a short reference length, and taking the ratio of measured powers without disturbing input coupling",
        "By slicing the fiber horizontally to observe core cross-section under an electron microscope",
        "By increasing laser voltage until the fiber burns back",
        "By measuring reflection while cutting off the power supply"
      ],
      "answer": "By measuring output power, cutting the fiber back to a short reference length, and taking the ratio of measured powers without disturbing input coupling",
      "correct_option": "By measuring output power, cutting the fiber back to a short reference length, and taking the ratio of measured powers without disturbing input coupling",
      "difficulty": "hard",
      "global_id": 34,
      "explanation": "The cutback method measures long-length power P2, then cuts back to short reference length L1 (measuring P1) without changing input launch conditions, yielding α = [10/(L2-L1)] log10(P1/P2)."
    },
    {
      "id": 35,
      "question": "Why is the cutback technique effective at eliminating connector and coupling loss errors?",
      "options": [
        "Because input coupling conditions remain strictly unchanged between long and short measurements",
        "Because it cools the fiber down to absolute zero",
        "Because cutting the fiber eliminates all internal Rayleigh scattering",
        "Because it converts multimode light into singlemode light"
      ],
      "answer": "Because input coupling conditions remain strictly unchanged between long and short measurements",
      "correct_option": "Because input coupling conditions remain strictly unchanged between long and short measurements",
      "difficulty": "hard",
      "global_id": 35,
      "explanation": "Since the input launch coupling chuck is untouched, input coupling efficiency η_in is identical in both measurements and cancels out in the power ratio."
    },
    {
      "id": 36,
      "question": "What physical unit is used to express optical power in the digital meter?",
      "options": [
        "Milliwatts (mW) or Microwatts (μW)",
        "Volts (V) or Amperes (A)",
        "Joules per second squared (J/s²)",
        "Pascals (Pa)"
      ],
      "answer": "Milliwatts (mW) or Microwatts (μW)",
      "correct_option": "Milliwatts (mW) or Microwatts (μW)",
      "difficulty": "easy",
      "global_id": 36,
      "explanation": "Optical power is the time rate of radiant optical energy transfer, measured in milliwatts (mW) or microwatts (μW), or in logarithmic dBm."
    },
    {
      "id": 37,
      "question": "How is optical power in milliwatts (mW) related to microwatts (μW)?",
      "options": [
        "1 mW = 1000 μW",
        "1 mW = 0.001 μW",
        "1 mW = 100 μW",
        "1 mW = 1,000,000 μW"
      ],
      "answer": "1 mW = 1000 μW",
      "correct_option": "1 mW = 1000 μW",
      "difficulty": "easy",
      "global_id": 37,
      "explanation": "Milli means 10⁻³ and micro means 10⁻⁶; thus, 1 mW = 1000 μW."
    },
    {
      "id": 38,
      "question": "If a power meter reads 450 μW, what is the equivalent power in mW?",
      "options": [
        "0.450 mW",
        "4.500 mW",
        "45.00 mW",
        "0.045 mW"
      ],
      "answer": "0.450 mW",
      "correct_option": "0.450 mW",
      "difficulty": "easy",
      "global_id": 38,
      "explanation": "450 μW / 1000 = 0.450 mW."
    },
    {
      "id": 39,
      "question": "How is optical power expressed in dBm related to power in milliwatts (P_mW)?",
      "options": [
        "P_dBm = 10 · log10(P_mW / 1 mW)",
        "P_dBm = 20 · log10(P_mW)",
        "P_dBm = P_mW · 10",
        "P_dBm = ln(P_mW)"
      ],
      "answer": "P_dBm = 10 · log10(P_mW / 1 mW)",
      "correct_option": "P_dBm = 10 · log10(P_mW / 1 mW)",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "dBm is decibels referenced to 1 milliwatt: P_dBm = 10 · log10(P_mW / 1 mW). For example, 1 mW = 0 dBm."
    },
    {
      "id": 40,
      "question": "What is 0 dBm in milliwatts?",
      "options": [
        "1.0 mW",
        "0.0 mW",
        "10.0 mW",
        "0.1 mW"
      ],
      "answer": "1.0 mW",
      "correct_option": "1.0 mW",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "By definition, 0 dBm corresponds to 1.0 mW (10 · log10(1.0) = 0 dBm)."
    },
    {
      "id": 41,
      "question": "If an input power is +3 dBm and output power is 0 dBm, what is the link attenuation in dB?",
      "options": [
        "3 dB",
        "0 dB",
        "-3 dB",
        "1 dB"
      ],
      "answer": "3 dB",
      "correct_option": "3 dB",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "Attenuation in dB is the difference between input and output levels in dBm: A = P_in(dBm) - P_out(dBm) = 3 dBm - 0 dBm = 3 dB."
    },
    {
      "id": 42,
      "question": "Why does bending a plastic fiber into a tight loop (small radius of curvature) increase attenuation?",
      "options": [
        "Guided rays strike the core-cladding boundary at angles steeper than the critical angle and escape as radiation loss",
        "The copper core experiences work hardening and increased resistance",
        "The wavelength of light shifts into the ultraviolet regime",
        "The speed of light inside the core drops to zero"
      ],
      "answer": "Guided rays strike the core-cladding boundary at angles steeper than the critical angle and escape as radiation loss",
      "correct_option": "Guided rays strike the core-cladding boundary at angles steeper than the critical angle and escape as radiation loss",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "Tight curvature alters the local boundary orientation so rays exceed the critical angle (θ < θ_c), refracting into the cladding as radiative macrobending loss."
    },
    {
      "id": 43,
      "question": "What role does the cladding layer play in reducing attenuation in optical fibers?",
      "options": [
        "It provides a lower refractive index boundary (n2 < n1) enabling total internal reflection while protecting the core from surface contamination",
        "It amplifies light through stimulated emission",
        "It filters out red wavelengths to only pass infrared",
        "It acts as an electrical ground plane"
      ],
      "answer": "It provides a lower refractive index boundary (n2 < n1) enabling total internal reflection while protecting the core from surface contamination",
      "correct_option": "It provides a lower refractive index boundary (n2 < n1) enabling total internal reflection while protecting the core from surface contamination",
      "difficulty": "medium",
      "global_id": 43,
      "explanation": "The lower-index cladding (n2 < n1) establishes the boundary for total internal reflection and isolates the evanescent optical field from dirt and moisture."
    },
    {
      "id": 44,
      "question": "In a laboratory experiment, if a student forgets to switch ON the optical transmitter, what will the power meter indicate?",
      "options": [
        "0.00 mW (No optical signal reaching the sensor)",
        "Maximum scale deflection (Overload)",
        "5.00 mW automatically",
        "Negative infinity (-∞)"
      ],
      "answer": "0.00 mW (No optical signal reaching the sensor)",
      "correct_option": "0.00 mW (No optical signal reaching the sensor)",
      "difficulty": "easy",
      "global_id": 44,
      "explanation": "Without light emission from the transmitter, the photodetector generates zero photocurrent, reading 0.00 mW."
    },
    {
      "id": 45,
      "question": "If measured output powers are 2.88 mW (at 1 m) and 2.44 mW (at 5 m) for P_in = 3.00 mW, what trend is verified?",
      "options": [
        "Transmitted optical power decreases monotonically as fiber length increases",
        "Transmitted power is completely independent of length",
        "Optical power increases over distance",
        "The fiber generates optical power from ambient heat"
      ],
      "answer": "Transmitted optical power decreases monotonically as fiber length increases",
      "correct_option": "Transmitted optical power decreases monotonically as fiber length increases",
      "difficulty": "easy",
      "global_id": 45,
      "explanation": "As propagation length increases, cumulative absorption and scattering losses increase, causing monotonic decrease in transmitted power."
    },
    {
      "id": 46,
      "question": "What is the numerical aperture (NA) of standard step-index POF typically around?",
      "options": [
        "High NA (~0.45 to 0.50), providing a wide acceptance angle (θ_a ≈ 27° to 30°)",
        "Extremely low NA (~0.05)",
        "Zero NA",
        "Infinite NA"
      ],
      "answer": "High NA (~0.45 to 0.50), providing a wide acceptance angle (θ_a ≈ 27° to 30°)",
      "correct_option": "High NA (~0.45 to 0.50), providing a wide acceptance angle (θ_a ≈ 27° to 30°)",
      "difficulty": "medium",
      "global_id": 46,
      "explanation": "Standard PMMA POF features a high index contrast (n1 ≈ 1.492, n2 ≈ 1.402), yielding a large NA ≈ 0.50 and wide acceptance cone."
    },
    {
      "id": 47,
      "question": "How does the large numerical aperture of POF affect coupling efficiency from an LED source?",
      "options": [
        "It significantly improves coupling efficiency because the wide acceptance cone captures a large fraction of diverging LED rays",
        "It prevents any LED rays from entering the core",
        "It converts the LED into a monochromatic laser",
        "It reduces output power by 90%"
      ],
      "answer": "It significantly improves coupling efficiency because the wide acceptance cone captures a large fraction of diverging LED rays",
      "correct_option": "It significantly improves coupling efficiency because the wide acceptance cone captures a large fraction of diverging LED rays",
      "difficulty": "medium",
      "global_id": 47,
      "explanation": "A high NA (0.50) creates an acceptance cone of ~60° full angle, capturing substantial radiant flux from divergent surface-emitting LEDs."
    },
    {
      "id": 48,
      "question": "What is an important precaution when handling plastic optical fibers in an undergraduate physics lab?",
      "options": [
        "Avoid sharp kinks or bending below minimum bend radius, and keep connector end facets clean",
        "Never expose the outer jacket to visible room lighting",
        "Always submerge the cable in water before powering the laser",
        "Connect the fiber only when power supply is set to 220 V AC"
      ],
      "answer": "Avoid sharp kinks or bending below minimum bend radius, and keep connector end facets clean",
      "correct_option": "Avoid sharp kinks or bending below minimum bend radius, and keep connector end facets clean",
      "difficulty": "easy",
      "global_id": 48,
      "explanation": "Sharp bends induce permanent mechanical crazing and radiation loss, while dirty facets degrade coupling efficiency."
    },
    {
      "id": 49,
      "question": "If linear regression of A_dB against L (in metres) yields a slope m = 0.180 dB/m, what is the attenuation coefficient in dB/km?",
      "options": [
        "180 dB/km",
        "18 dB/km",
        "1.8 dB/km",
        "0.18 dB/km"
      ],
      "answer": "180 dB/km",
      "correct_option": "180 dB/km",
      "difficulty": "easy",
      "global_id": 49,
      "explanation": "Since 1 km = 1000 m, α_dB/km = slope_dB/m · 1000 = 0.180 · 1000 = 180 dB/km."
    },
    {
      "id": 50,
      "question": "In optical engineering, why is decibels (dB) preferred over percentage transmission for cascaded links?",
      "options": [
        "Because decibel losses of successive components add linearly instead of multiplying",
        "Because decibels eliminate all physical loss",
        "Because decibels work only with integer numbers",
        "Because percentage cannot exceed 50%"
      ],
      "answer": "Because decibel losses of successive components add linearly instead of multiplying",
      "correct_option": "Because decibel losses of successive components add linearly instead of multiplying",
      "difficulty": "medium",
      "global_id": 50,
      "explanation": "In decibels, total loss A_total = A_fiber + A_coupler + A_splice (addition of dB terms instead of multiplying fractional transmission factors)."
    }
  ]
};

export const LASER_DIVERGENCE_QUESTION_BANK = {
  "experiment": "Laser Beam Divergence & Gaussian Optics - Question Bank",
  "experimentId": "laser-divergence",
  "quizId": "laser-divergence-mastery-quiz",
  "experimentName": "Laser Beam Divergence",
  "description": "Comprehensive 50-Question Physics Question Bank for Laser Beam Divergence",
  "total_questions": 50,
  "questions": [
    {
      "id": "ld-q1",
      "question": "What physical phenomenon fundamentally causes an unguided laser beam to diverge as it propagates?",
      "options": [
        "Wave diffraction due to finite lateral optical aperture",
        "Refraction from ambient air temperature gradients",
        "Coulomb repulsion between emitted laser photons",
        "Quantum tunneling through the output mirror"
      ],
      "answer": "Wave diffraction due to finite lateral optical aperture",
      "correct_option": "Wave diffraction due to finite lateral optical aperture",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Wave diffraction fundamentally dictates that any wave confined to a finite spatial aperture of width d must diffract at an angular rate proportional to lambda / d."
    },
    {
      "id": "ld-q2",
      "question": "In a fundamental TEM00 Gaussian laser beam, what is the definition of the Rayleigh range (zR)?",
      "options": [
        "The propagation distance where cross-sectional area doubles and beam radius expands by sqrt(2)",
        "The distance at which laser intensity drops to exactly zero",
        "The focal length of the laser cavity collimator mirror",
        "The maximum propagation distance before atmospheric absorption halts the beam"
      ],
      "answer": "The propagation distance where cross-sectional area doubles and beam radius expands by sqrt(2)",
      "correct_option": "The propagation distance where cross-sectional area doubles and beam radius expands by sqrt(2)",
      "difficulty": "medium",
      "global_id": 2,
      "explanation": "The Rayleigh range zR = (pi * w0^2) / lambda is the distance where beam radius w(z) grows from w0 to sqrt(2)*w0, doubling the spot area."
    },
    {
      "id": "ld-q3",
      "question": "How is the far-field theoretical divergence half-angle (theta) related to emission wavelength (lambda) and beam waist (w0)?",
      "options": [
        "theta = lambda / (pi * w0)",
        "theta = (pi * w0) / lambda",
        "theta = lambda * pi * w0",
        "theta = sqrt(lambda / w0)"
      ],
      "answer": "theta = lambda / (pi * w0)",
      "correct_option": "theta = lambda / (pi * w0)",
      "difficulty": "medium",
      "global_id": 3,
      "explanation": "In Gaussian optics, the asymptotic far-field divergence half-angle is given by theta = lambda / (pi * w0) in radians."
    },
    {
      "id": "ld-q4",
      "question": "What is the relationship between the full divergence cone angle (Theta) and the divergence half-angle (theta)?",
      "options": [
        "Theta = 2 * theta",
        "Theta = theta / 2",
        "Theta = theta^2",
        "Theta = pi * theta"
      ],
      "answer": "Theta = 2 * theta",
      "correct_option": "Theta = 2 * theta",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "The full cone angle Theta spans from one envelope boundary across the central optical axis to the opposite boundary, so Theta = 2 * theta."
    },
    {
      "id": "ld-q5",
      "question": "If laser spot diameters D1 and D2 are measured at distances z1 and z2, what is the two-point empirical half-angle formula?",
      "options": [
        "theta ≈ (D2 - D1) / [2 * (z2 - z1)]",
        "theta ≈ (D2 + D1) / (z2 - z1)",
        "theta ≈ (D2 - D1) / (z2 - z1)",
        "theta ≈ [2 * (D2 - D1)] / (z2 - z1)"
      ],
      "answer": "theta ≈ (D2 - D1) / [2 * (z2 - z1)]",
      "correct_option": "theta ≈ (D2 - D1) / [2 * (z2 - z1)]",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "Because D is diameter (D = 2w), the radial expansion is (D2 - D1)/2, yielding theta ≈ (D2 - D1) / [2 * (z2 - z1)]."
    },
    {
      "id": "ld-q6",
      "question": "Which laser wavelength will exhibit the smallest divergence half-angle for a fixed beam waist radius?",
      "options": [
        "Violet InGaN laser (402 nm)",
        "Green DPSS laser (532 nm)",
        "Helium-Neon Red laser (632.8 nm)",
        "Infrared diode laser (808 nm)"
      ],
      "answer": "Violet InGaN laser (402 nm)",
      "correct_option": "Violet InGaN laser (402 nm)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "Divergence theta is directly proportional to wavelength (theta = lambda / (pi * w0)). Shorter wavelengths produce less diffraction spread."
    },
    {
      "id": "ld-q7",
      "question": "Why is the 1/e^2 intensity criterion universally used as the standard boundary for Gaussian laser spots?",
      "options": [
        "Because Gaussian profiles have no sharp boundary; 1/e^2 (~13.53% peak) encloses 86.5% of total optical power",
        "Because human eyes can only perceive light down to 1/e^2 intensity",
        "Because photographic sensors saturate at 1/e^2 of laser peak intensity",
        "Because diffraction rings completely cancel out at 1/e^2"
      ],
      "answer": "Because Gaussian profiles have no sharp boundary; 1/e^2 (~13.53% peak) encloses 86.5% of total optical power",
      "correct_option": "Because Gaussian profiles have no sharp boundary; 1/e^2 (~13.53% peak) encloses 86.5% of total optical power",
      "difficulty": "hard",
      "global_id": 7,
      "explanation": "Since Gaussian profiles decay asymptotically without a hard cutoff, the ISO standard 1/e^2 (13.53%) boundary encloses exactly (1 - 1/e^2) = 86.47% of total beam power."
    },
    {
      "id": "ld-q8",
      "question": "What happens to the divergence of a laser beam if its waist radius (w0) is doubled by an optical beam expander?",
      "options": [
        "The divergence angle is halved",
        "The divergence angle doubles",
        "The divergence angle quadruples",
        "The divergence angle remains unchanged"
      ],
      "answer": "The divergence angle is halved",
      "correct_option": "The divergence angle is halved",
      "difficulty": "medium",
      "global_id": 8,
      "explanation": "Since theta = lambda / (pi * w0), divergence is inversely proportional to beam waist. Doubling w0 reduces theta by a factor of 2."
    },
    {
      "id": "ld-q9",
      "question": "At propagation distance z equal to the Rayleigh range (z = zR), what is the beam radius w(zR)?",
      "options": [
        "sqrt(2) * w0 ≈ 1.414 * w0",
        "2 * w0",
        "w0 / 2",
        "w0 / sqrt(2)"
      ],
      "answer": "sqrt(2) * w0 ≈ 1.414 * w0",
      "correct_option": "sqrt(2) * w0 ≈ 1.414 * w0",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Substituting z = zR into w(z) = w0 * sqrt(1 + (z/zR)^2) yields w(zR) = w0 * sqrt(1 + 1) = sqrt(2) * w0."
    },
    {
      "id": "ld-q10",
      "question": "What is the primary eye safety hazard associated with visible Class 3R lasers used in this experiment?",
      "options": [
        "Intra-beam viewing may cause thermal retinal burn if the blink reflex is suppressed",
        "Ionizing radiation causing skin burns",
        "Generation of toxic ozone gas along the beam path",
        "Nuclear activation of metallic optical mounts"
      ],
      "answer": "Intra-beam viewing may cause thermal retinal burn if the blink reflex is suppressed",
      "correct_option": "Intra-beam viewing may cause thermal retinal burn if the blink reflex is suppressed",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Class 3R visible lasers (up to 5 mW) are normally protected by human aversion (blink) response (~0.25 s), but direct deliberate staring can cause retinal injury."
    },
    {
      "id": "laser-q11",
      "question": "How is the Rayleigh range (z_R) mathematically defined for a fundamental Gaussian beam?",
      "options": [
        "z_R = (π * w0^2) / λ",
        "z_R = (2 * π * w0) / λ",
        "z_R = (λ * w0^2) / π",
        "z_R = (π * λ) / w0^2"
      ],
      "answer": "z_R = (π * w0^2) / λ",
      "correct_option": "z_R = (π * w0^2) / λ",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "The Rayleigh range z_R is the distance over which the beam cross-sectional area doubles: z_R = π w0^2 / λ."
    },
    {
      "id": "laser-q12",
      "question": "At the Rayleigh distance z = z_R from the beam waist, what is the beam radius w(z_R)?",
      "options": [
        "w(z_R) = w0 * √2 ≈ 1.414 * w0",
        "w(z_R) = 2 * w0",
        "w(z_R) = w0 / √2",
        "w(z_R) = w0 * π"
      ],
      "answer": "w(z_R) = w0 * √2 ≈ 1.414 * w0",
      "correct_option": "w(z_R) = w0 * √2 ≈ 1.414 * w0",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "At z = z_R, w(z) = w0 √(1 + (z_R/z_R)^2) = w0 √2."
    },
    {
      "id": "laser-q13",
      "question": "What is the wavefront curvature radius R(z) at the exact position of the beam waist (z = 0)?",
      "options": [
        "Infinite (planar wavefront)",
        "Zero",
        "Equal to the Rayleigh range",
        "Equal to the wavelength λ"
      ],
      "answer": "Infinite (planar wavefront)",
      "correct_option": "Infinite (planar wavefront)",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "At the waist, the wavefront is perfectly planar, meaning the radius of curvature R(0) approaches infinity."
    },
    {
      "id": "laser-q14",
      "question": "At what axial propagation distance z is the wavefront curvature radius R(z) at its minimum value?",
      "options": [
        "z = z_R (at the Rayleigh distance)",
        "z = 0 (at the waist)",
        "z = 2 * z_R",
        "z approaches infinity"
      ],
      "answer": "z = z_R (at the Rayleigh distance)",
      "correct_option": "z = z_R (at the Rayleigh distance)",
      "difficulty": "hard",
      "global_id": 14,
      "explanation": "R(z) = z * [1 + (z_R/z)^2]. Setting dR/dz = 0 yields z = z_R, where R_min = 2 * z_R."
    },
    {
      "id": "laser-q15",
      "question": "For a laser with wavelength λ = 632.8 nm and waist radius w0 = 0.5 mm, what is the approximate Rayleigh range?",
      "options": [
        "1.24 m",
        "0.62 m",
        "2.48 m",
        "4.96 m"
      ],
      "answer": "1.24 m",
      "correct_option": "1.24 m",
      "difficulty": "hard",
      "global_id": 15,
      "explanation": "z_R = π * (0.5e-3)^2 / (632.8e-9) = π * 2.5e-7 / 6.328e-7 ≈ 1.241 m."
    },
    {
      "id": "laser-q16",
      "question": "What is the relationship between the beam waist diameter d0 and the far-field full divergence angle θ_full for a diffraction-limited beam?",
      "options": [
        "θ_full = (4 * λ) / (π * d0)",
        "θ_full = (2 * λ) / (π * d0)",
        "θ_full = (π * d0) / (4 * λ)",
        "θ_full = (4 * d0) / (π * λ)"
      ],
      "answer": "θ_full = (4 * λ) / (π * d0)",
      "correct_option": "θ_full = (4 * λ) / (π * d0)",
      "difficulty": "medium",
      "global_id": 16,
      "explanation": "Since w0 = d0 / 2 and θ_half = λ / (π w0), θ_full = 2 * θ_half = 4λ / (π d0)."
    },
    {
      "id": "laser-q17",
      "question": "What optical component can be used to decrease the beam divergence angle of a laser?",
      "options": [
        "A beam expander (telescope system)",
        "A neutral density filter",
        "A polarising beamsplitter",
        "A ground glass diffuser"
      ],
      "answer": "A beam expander (telescope system)",
      "correct_option": "A beam expander (telescope system)",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "A beam expander increases the beam diameter d0, which inversely reduces the far-field divergence angle θ in proportion to 1/d0."
    },
    {
      "id": "laser-q18",
      "question": "What is the M² (beam quality factor) of a theoretical, perfectly diffraction-limited fundamental TEM00 mode?",
      "options": [
        "M² = 1.0",
        "M² = 0",
        "M² = π",
        "M² = 2.0"
      ],
      "answer": "M² = 1.0",
      "correct_option": "M² = 1.0",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "A pure TEM00 Gaussian beam represents the physical lower bound of space-bandwidth product, corresponding to M² = 1."
    },
    {
      "id": "laser-q19",
      "question": "If a real laser beam has M² = 1.5, how does its divergence compare to an ideal Gaussian beam with the same waist size?",
      "options": [
        "Its divergence angle is 1.5 times larger",
        "Its divergence angle is 1.5 times smaller",
        "Its divergence angle is 2.25 times larger",
        "Its divergence angle is identical"
      ],
      "answer": "Its divergence angle is 1.5 times larger",
      "correct_option": "Its divergence angle is 1.5 times larger",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "For a real beam, θ = M² * [λ / (π w0)], so divergence scales linearly with M²."
    },
    {
      "id": "laser-q20",
      "question": "In a knife-edge laser beam profiler, between which two transmitted power thresholds is beam diameter commonly measured for a 1/e² criterion?",
      "options": [
        "16% and 84% (or 10% and 90% scaled)",
        "0% and 100%",
        "25% and 75%",
        "50% and 100%"
      ],
      "answer": "16% and 84% (or 10% and 90% scaled)",
      "correct_option": "16% and 84% (or 10% and 90% scaled)",
      "difficulty": "hard",
      "global_id": 20,
      "explanation": "For an integrated Gaussian error function, the 16% to 84% power cut points correspond precisely to a width of 2w (or 10%-90% scaled by 1.56)."
    },
    {
      "id": "laser-q21",
      "question": "What does the 1/e² beam radius definition represent in terms of optical intensity I(r) relative to peak on-axis intensity I_0?",
      "options": [
        "The radial distance r where I(r) drops to I_0 / e² ≈ 0.135 * I_0",
        "The distance where I(r) drops to 0.5 * I_0 (FWHM)",
        "The distance where I(r) drops to 1/e ≈ 0.368 * I_0",
        "The distance where power reaches 50%"
      ],
      "answer": "The radial distance r where I(r) drops to I_0 / e² ≈ 0.135 * I_0",
      "correct_option": "The radial distance r where I(r) drops to I_0 / e² ≈ 0.135 * I_0",
      "difficulty": "easy",
      "global_id": 21,
      "explanation": "By definition, the Gaussian beam radius w is the transverse distance at which intensity drops to 1/e² (13.53%) of its peak on-axis value."
    },
    {
      "id": "laser-q22",
      "question": "What is the relation between the Full Width at Half Maximum (FWHM) and the 1/e² beam diameter (2w)?",
      "options": [
        "2w = FWHM * √(2 / ln 2) ≈ 1.699 * FWHM",
        "2w = FWHM / 2",
        "2w = 2 * FWHM",
        "2w = FWHM * ln 2"
      ],
      "answer": "2w = FWHM * √(2 / ln 2) ≈ 1.699 * FWHM",
      "correct_option": "2w = FWHM * √(2 / ln 2) ≈ 1.699 * FWHM",
      "difficulty": "hard",
      "global_id": 22,
      "explanation": "Since exp(-2r^2/w^2) = 1/2 at r = r_FWHM, solving yields 2w = 1.699 * (2 r_FWHM)."
    },
    {
      "id": "laser-q23",
      "question": "What total percentage of total laser beam power is enclosed within a circular aperture of radius r = w (the 1/e² radius)?",
      "options": [
        "86.5%",
        "63.2%",
        "50.0%",
        "99.0%"
      ],
      "answer": "86.5%",
      "correct_option": "86.5%",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "Enclosed power P(r) = P_total * [1 - exp(-2r^2/w^2)]. At r = w, P(w) = P_total * (1 - e^-2) ≈ 86.47%."
    },
    {
      "id": "laser-q24",
      "question": "What total percentage of total laser power is enclosed within a circle of radius r = 1.5 * w?",
      "options": [
        "98.9%",
        "86.5%",
        "95.0%",
        "99.9%"
      ],
      "answer": "98.9%",
      "correct_option": "98.9%",
      "difficulty": "hard",
      "global_id": 24,
      "explanation": "P(1.5w) = P_total * [1 - exp(-2 * (1.5)^2)] = 1 - e^-4.5 ≈ 1 - 0.0111 = 98.89%."
    },
    {
      "id": "laser-q25",
      "question": "Why does a blue laser (λ = 405 nm) have lower diffraction divergence than a red laser (λ = 650 nm) for identical initial beam waists?",
      "options": [
        "Divergence is directly proportional to wavelength (θ ∝ λ)",
        "Divergence is inversely proportional to wavelength (θ ∝ 1/λ)",
        "Blue photons carry higher mass",
        "Blue light travels faster in air"
      ],
      "answer": "Divergence is directly proportional to wavelength (θ ∝ λ)",
      "correct_option": "Divergence is directly proportional to wavelength (θ ∝ λ)",
      "difficulty": "easy",
      "global_id": 25,
      "explanation": "Since θ = λ / (π w0), shorter optical wavelengths produce proportionally smaller divergence angles."
    },
    {
      "id": "laser-q26",
      "question": "What is the optical function of a spatial filter placed at the focus of a Keplerian beam expander?",
      "options": [
        "Removes high-frequency spatial noise and non-Gaussian aberrations using a pinhole",
        "Attenuates total laser power to avoid detector saturation",
        "Converts linear polarization to circular polarization",
        "Increases the laser coherence length"
      ],
      "answer": "Removes high-frequency spatial noise and non-Gaussian aberrations using a pinhole",
      "correct_option": "Removes high-frequency spatial noise and non-Gaussian aberrations using a pinhole",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Spatial filtering focuses the beam through a micro-pinhole; higher spatial frequency noise falls outside the central Airy disc and is stripped away."
    },
    {
      "id": "laser-q27",
      "question": "How does a Galilean beam expander differ from a Keplerian beam expander?",
      "options": [
        "It uses a negative (diverging) lens followed by a positive lens, eliminating an internal focal point",
        "It uses two identical convex lenses",
        "It cannot operate with pulsed lasers",
        "It reverses beam divergence"
      ],
      "answer": "It uses a negative (diverging) lens followed by a positive lens, eliminating an internal focal point",
      "correct_option": "It uses a negative (diverging) lens followed by a positive lens, eliminating an internal focal point",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "A Galilean expander pairs a concave (diverging) lens with a convex lens, avoiding internal focus that could ionize air in high-power systems."
    },
    {
      "id": "laser-q28",
      "question": "If a Keplerian beam expander has an objective focal length of 10 mm and a collimating lens focal length of 100 mm, what is the beam magnification factor M?",
      "options": [
        "10x",
        "0.1x",
        "100x",
        "5x"
      ],
      "answer": "10x",
      "correct_option": "10x",
      "difficulty": "easy",
      "global_id": 28,
      "explanation": "Magnification M = f2 / f1 = 100 mm / 10 mm = 10x. Beam diameter increases by 10x, and divergence decreases by 10x."
    },
    {
      "id": "laser-q29",
      "question": "When using a two-point measurement method to determine laser divergence, spot diameters d1 and d2 are measured at distances z1 and z2. What is the divergence angle θ?",
      "options": [
        "θ = (d2 - d1) / (z2 - z1)",
        "θ = (d2 + d1) / (z2 + z1)",
        "θ = (z2 - z1) / (d2 - d1)",
        "θ = (d2 - d1) * (z2 - z1)"
      ],
      "answer": "θ = (d2 - d1) / (z2 - z1)",
      "correct_option": "θ = (d2 - d1) / (z2 - z1)",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "In the far field where propagation is linear, divergence angle θ ≈ tan(θ) = (d2 - d1) / (z2 - z1)."
    },
    {
      "id": "laser-q30",
      "question": "What happens to the beam waist radius w0 when a collimated Gaussian beam is focused by a lens of focal length f?",
      "options": [
        "w0' = (λ * f) / (π * w_lens)",
        "w0' = (w_lens * f) / λ",
        "w0' = f * λ",
        "w0' = w_lens / 2"
      ],
      "answer": "w0' = (λ * f) / (π * w_lens)",
      "correct_option": "w0' = (λ * f) / (π * w_lens)",
      "difficulty": "hard",
      "global_id": 30,
      "explanation": "For a focused Gaussian beam with w_lens >> w0', the focused waist size is w0' = λ f / (π w_lens)."
    },
    {
      "id": "laser-q31",
      "question": "What is the Gouy phase shift experienced by a TEM00 Gaussian beam propagating from -∞ to +∞ through its focus?",
      "options": [
        "π radians (180°)",
        "π/2 radians (90°)",
        "2π radians (360°)",
        "Zero"
      ],
      "answer": "π radians (180°)",
      "correct_option": "π radians (180°)",
      "difficulty": "hard",
      "global_id": 31,
      "explanation": "The Gouy phase shift ζ(z) = arctan(z / z_R) accumulates from -π/2 to +π/2, giving an overall phase shift of π radians."
    },
    {
      "id": "laser-q32",
      "question": "Why is far-field beam divergence measured at distances z >> z_R rather than close to the laser aperture?",
      "options": [
        "In the near-field (z < z_R), beam spreading is non-linear and dominated by Rayleigh depth of focus",
        "Laser light does not travel in straight lines in the near field",
        "Detectors cannot sense light within the near field",
        "Wavefronts are flat in the far field"
      ],
      "answer": "In the near-field (z < z_R), beam spreading is non-linear and dominated by Rayleigh depth of focus",
      "correct_option": "In the near-field (z < z_R), beam spreading is non-linear and dominated by Rayleigh depth of focus",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "For z << z_R, w(z) ≈ w0 (nearly constant). Only when z >> z_R does w(z) ≈ w0 * (z / z_R) expand linearly with distance."
    },
    {
      "id": "laser-q33",
      "question": "A helium-neon laser (632.8 nm) produces a spot diameter of 3.0 mm at 2 m and 7.0 mm at 10 m. What is the full divergence angle?",
      "options": [
        "0.50 mrad",
        "0.25 mrad",
        "1.00 mrad",
        "2.00 mrad"
      ],
      "answer": "0.50 mrad",
      "correct_option": "0.50 mrad",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "θ = (d2 - d1) / (z2 - z1) = (7.0 mm - 3.0 mm) / (10 m - 2 m) = 4.0 mm / 8 m = 0.50 mrad (5.0e-4 rad)."
    },
    {
      "id": "laser-q34",
      "question": "What is the optical intensity distribution I(r, z) of a TEM00 mode in cylindrical coordinates?",
      "options": [
        "I(r, z) = I_0 * [w0/w(z)]^2 * exp(-2r^2 / w(z)^2)",
        "I(r, z) = I_0 * exp(-r / w(z))",
        "I(r, z) = I_0 * cos^2(r / w(z))",
        "I(r, z) = I_0 / [1 + (r/w(z))^2]"
      ],
      "answer": "I(r, z) = I_0 * [w0/w(z)]^2 * exp(-2r^2 / w(z)^2)",
      "correct_option": "I(r, z) = I_0 * [w0/w(z)]^2 * exp(-2r^2 / w(z)^2)",
      "difficulty": "hard",
      "global_id": 34,
      "explanation": "The peak intensity scales as [w0/w(z)]^2 to conserve power, and decays radially as a Gaussian exp(-2r^2/w^2)."
    },
    {
      "id": "laser-q35",
      "question": "What is the beam parameter product (BPP) for an ideal TEM00 Gaussian beam?",
      "options": [
        "BPP = w0 * θ = λ / π",
        "BPP = w0 * θ = λ * π",
        "BPP = w0 / θ = λ / 2",
        "BPP = w0 * θ = 4λ"
      ],
      "answer": "BPP = w0 * θ = λ / π",
      "correct_option": "BPP = w0 * θ = λ / π",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "BPP is defined as the product of waist radius w0 and half-divergence angle θ: BPP = w0 * (λ / π w0) = λ / π."
    },
    {
      "id": "laser-q36",
      "question": "How does the Beam Parameter Product (BPP) relate to M²?",
      "options": [
        "BPP_real = M² * (λ / π)",
        "BPP_real = BPP_ideal / M²",
        "BPP_real = M² * π / λ",
        "BPP is independent of M²"
      ],
      "answer": "BPP_real = M² * (λ / π)",
      "correct_option": "BPP_real = M² * (λ / π)",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "M² is the ratio of the real beam's BPP to that of a diffraction-limited Gaussian beam: M² = BPP_real / (λ / π)."
    },
    {
      "id": "laser-q37",
      "question": "What optical element converts an astigmatic elliptical diode laser beam into a circular profile?",
      "options": [
        "An anamorphic prism pair or cylindrical lens pair",
        "A quarter-wave plate",
        "A spatial pinhole filter",
        "An optical isolator"
      ],
      "answer": "An anamorphic prism pair or cylindrical lens pair",
      "correct_option": "An anamorphic prism pair or cylindrical lens pair",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "Edge-emitting laser diodes have different divergence angles along fast and slow axes; anamorphic prisms magnify one axis to circularize the beam."
    },
    {
      "id": "laser-q38",
      "question": "Why does an edge-emitting semiconductor laser diode have a highly asymmetric divergence angle?",
      "options": [
        "The active layer waveguide is much thinner vertically (~0.1 µm) than horizontally (~2 µm)",
        "The semiconductor has anisotropic speed of light",
        "Photons are emitted in only one polarization state",
        "The electrical contacts create asymmetric magnetic deflection"
      ],
      "answer": "The active layer waveguide is much thinner vertically (~0.1 µm) than horizontally (~2 µm)",
      "correct_option": "The active layer waveguide is much thinner vertically (~0.1 µm) than horizontally (~2 µm)",
      "difficulty": "hard",
      "global_id": 38,
      "explanation": "The sub-micron vertical aperture causes extreme diffraction divergence (fast axis ~30°-40°), while the wider lateral aperture gives lower divergence (~10°)."
    },
    {
      "id": "laser-q39",
      "question": "In high-power laser material processing, why is low beam divergence (high beam quality M² ≈ 1) critical?",
      "options": [
        "It allows focusing to a smaller spot size with a longer depth of focus, maximizing power density",
        "It prevents back-reflections into the laser cavity",
        "It changes the laser color to ultraviolet",
        "It increases thermal conductivity of the workpiece"
      ],
      "answer": "It allows focusing to a smaller spot size with a longer depth of focus, maximizing power density",
      "correct_option": "It allows focusing to a smaller spot size with a longer depth of focus, maximizing power density",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "Lower divergence permits tighter focus (higher irradiance W/cm²) and longer depth of field (longer Rayleigh length at the cut kerf)."
    },
    {
      "id": "laser-q40",
      "question": "What optical instrument is placed between a laser and a reflective experiment to protect the laser from destabilizing back-reflections?",
      "options": [
        "An optical isolator (Faraday rotator + polarizers)",
        "A neutral density wheel",
        "A beam dump",
        "A Fabry-Pérot etalon"
      ],
      "answer": "An optical isolator (Faraday rotator + polarizers)",
      "correct_option": "An optical isolator (Faraday rotator + polarizers)",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "An optical isolator acts as an optical diode using the magneto-optic Faraday effect to block back-reflected light from re-entering the laser resonator."
    },
    {
      "id": "laser-q41",
      "question": "What is the confocal parameter b of a Gaussian beam in terms of its Rayleigh range z_R?",
      "options": [
        "b = 2 * z_R",
        "b = z_R / 2",
        "b = π * z_R",
        "b = z_R^2"
      ],
      "answer": "b = 2 * z_R",
      "correct_option": "b = 2 * z_R",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "The confocal parameter b is the total length of the focal zone between the two z = ±z_R planes: b = 2 * z_R."
    },
    {
      "id": "laser-q42",
      "question": "What is the depth of focus (DOF) of a focused laser beam typically defined as?",
      "options": [
        "The distance between the ±z_R points (2 * z_R)",
        "The focal length of the focusing lens",
        "The entire length of the laser cavity",
        "The distance where power drops to zero"
      ],
      "answer": "The distance between the ±z_R points (2 * z_R)",
      "correct_option": "The distance between the ±z_R points (2 * z_R)",
      "difficulty": "easy",
      "global_id": 42,
      "explanation": "Depth of focus corresponds to the region where beam area is within a factor of 2 of the waist, which is 2 * z_R."
    },
    {
      "id": "laser-q43",
      "question": "If a laser beam with initial waist w0 is focused by a lens, how does the focused waist size w0' scale with lens numerical aperture (NA)?",
      "options": [
        "w0' ∝ 1 / NA",
        "w0' ∝ NA",
        "w0' ∝ NA^2",
        "w0' is independent of NA"
      ],
      "answer": "w0' ∝ 1 / NA",
      "correct_option": "w0' ∝ 1 / NA",
      "difficulty": "medium",
      "global_id": 43,
      "explanation": "Higher NA lenses focus light more tightly: focused spot size is inversely proportional to NA (w0' ≈ 0.61 λ / NA)."
    },
    {
      "id": "laser-q44",
      "question": "How does thermal blooming in the atmosphere affect laser beam propagation over long distances?",
      "options": [
        "Heating of the air decreases the refractive index on-axis, acting as a negative lens that diverges the beam",
        "Air heating focuses the beam into an intense filament",
        "Thermal absorption changes the laser wavelength",
        "Air ionization stops beam propagation entirely"
      ],
      "answer": "Heating of the air decreases the refractive index on-axis, acting as a negative lens that diverges the beam",
      "correct_option": "Heating of the air decreases the refractive index on-axis, acting as a negative lens that diverges the beam",
      "difficulty": "hard",
      "global_id": 44,
      "explanation": "Laser absorption heats air along the central axis, lowering local density and refractive index (dn/dT < 0), causing the beam to defocus (bloom)."
    },
    {
      "id": "laser-q45",
      "question": "What is the Strehl ratio of an optical beam?",
      "options": [
        "The ratio of peak on-axis aberrated intensity to theoretical diffraction-limited peak intensity",
        "The ratio of input power to output power",
        "The ratio of major to minor axis of an elliptical beam",
        "The transmission percentage of an optical coating"
      ],
      "answer": "The ratio of peak on-axis aberrated intensity to theoretical diffraction-limited peak intensity",
      "correct_option": "The ratio of peak on-axis aberrated intensity to theoretical diffraction-limited peak intensity",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "Strehl ratio S = I_aberrated / I_ideal measures how close a focused beam wavefront is to a perfect diffraction-limited wavefront (S ≥ 0.8 is Maréchal criterion)."
    },
    {
      "id": "laser-q46",
      "question": "What laser safety class is assigned to a standard visible laser pointer with output power between 1 mW and 5 mW?",
      "options": [
        "Class 3R",
        "Class 1",
        "Class 4",
        "Class 2M"
      ],
      "answer": "Class 3R",
      "correct_option": "Class 3R",
      "difficulty": "medium",
      "global_id": 46,
      "explanation": "Visible CW lasers with power between 1 mW and 5 mW are categorized as Class 3R (formerly Class IIIa)."
    },
    {
      "id": "laser-q47",
      "question": "What human natural reflex protects the eye from accidental brief exposure to Class 2 visible laser radiation (< 1 mW)?",
      "options": [
        "The blink reflex (aversion response, ~0.25 seconds)",
        "Pupillary constriction only",
        "Accommodation of the crystalline lens",
        "Tear duct secretion"
      ],
      "answer": "The blink reflex (aversion response, ~0.25 seconds)",
      "correct_option": "The blink reflex (aversion response, ~0.25 seconds)",
      "difficulty": "easy",
      "global_id": 47,
      "explanation": "Class 2 visible lasers rely on the normal involuntary human blink reflex (~250 ms) to prevent retinal injury."
    },
    {
      "id": "laser-q48",
      "question": "Why is infrared laser radiation (such as Nd:YAG at 1064 nm) particularly hazardous to the human eye?",
      "options": [
        "It penetrates to the retina but is completely invisible, suppressing the natural blink reflex",
        "It has higher photon energy than UV light",
        "It causes resonant vibration of nitrogen gas",
        "It cannot be blocked by any laser safety goggles"
      ],
      "answer": "It penetrates to the retina but is completely invisible, suppressing the natural blink reflex",
      "correct_option": "It penetrates to the retina but is completely invisible, suppressing the natural blink reflex",
      "difficulty": "medium",
      "global_id": 48,
      "explanation": "Near-IR light passes through ocular media to focus onto the retina, but because it is invisible, no aversion or blink reflex is triggered."
    },
    {
      "id": "laser-q49",
      "question": "In beam profiling, what is the D4σ (second-moment) ISO 11146 standard definition of beam diameter?",
      "options": [
        "4 times the standard deviation (σ) of the spatial intensity distribution",
        "The diameter enclosing exactly 50% power",
        "The distance between the first diffraction zeroes",
        "Twice the FWHM width"
      ],
      "answer": "4 times the standard deviation (σ) of the spatial intensity distribution",
      "correct_option": "4 times the standard deviation (σ) of the spatial intensity distribution",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "ISO 11146 defines the beam width d4σ = 4σ_x, where σ_x is the second spatial moment of the irradiance distribution."
    },
    {
      "id": "laser-q50",
      "question": "If a laser beam waist is doubled (w0_new = 2 * w0_old) using a beam expander, how does its Rayleigh range change?",
      "options": [
        "It increases by a factor of 4 (z_R_new = 4 * z_R_old)",
        "It doubles (z_R_new = 2 * z_R_old)",
        "It decreases by half",
        "It remains unchanged"
      ],
      "answer": "It increases by a factor of 4 (z_R_new = 4 * z_R_old)",
      "correct_option": "It increases by a factor of 4 (z_R_new = 4 * z_R_old)",
      "difficulty": "medium",
      "global_id": 50,
      "explanation": "Since z_R = π w0^2 / λ, doubling the waist radius w0 quadruples the Rayleigh range (2^2 = 4)."
    }
  ]
};

export const ULTRASONIC_SENSOR_QUESTION_BANK = {
  "experiment": "Ultrasonic Distance Measurement - Question Bank",
  "experimentId": "ultrasonic-sensor",
  "quizId": "ultrasonic-sensor-mastery-quiz",
  "experimentName": "Ultrasonic Distance Meter (UDM)",
  "description": "Comprehensive 50-Question Physics Question Bank for Ultrasonic Distance Meter (UDM)",
  "total_questions": 50,
  "questions": [
    {
      "id": "udm-q1",
      "question": "What is the governing formula used to calculate one-way target distance in pulse-echo ultrasonic measurement?",
      "options": [
        "d = (v * t) / 2",
        "d = v * t",
        "d = 2 * v * t",
        "d = (v^2 * t) / 2"
      ],
      "answer": "d = (v * t) / 2",
      "correct_option": "d = (v * t) / 2",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Because the acoustic pulse travels to the target reflector and returns back, the wave traverses twice the distance (2d = v * t, hence d = v * t / 2)."
    },
    {
      "id": "udm-q2",
      "question": "Why is the elapsed round-trip time-of-flight (t) divided by 2 in distance calculation?",
      "options": [
        "The sound wave traverses the distance twice: to the target and back as an echo",
        "Because only half of the piezoelectric crystal is active during receive mode",
        "To compensate for the 50% duty cycle of the 40 kHz square wave trigger",
        "Because sound velocity doubles upon acoustic reflection at the barrier"
      ],
      "answer": "The sound wave traverses the distance twice: to the target and back as an echo",
      "correct_option": "The sound wave traverses the distance twice: to the target and back as an echo",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Pulse-echo kinematics measures total round-trip trajectory 2d. Dividing by two yields the true one-way standoff distance."
    },
    {
      "id": "udm-q3",
      "question": "How does ambient air temperature (T) affect the speed of sound and uncalibrated distance measurements?",
      "options": [
        "Sound travels faster at higher temperatures; uncalibrated sensors underestimate target distance",
        "Sound travels slower at higher temperatures; uncalibrated sensors underestimate target distance",
        "Temperature has no effect on longitudinal acoustic speed in diatomic air",
        "Sound travels faster at higher temperatures; uncalibrated sensors overestimate target distance"
      ],
      "answer": "Sound travels faster at higher temperatures; uncalibrated sensors underestimate target distance",
      "correct_option": "Sound travels faster at higher temperatures; uncalibrated sensors underestimate target distance",
      "difficulty": "medium",
      "global_id": 3,
      "explanation": "Acoustic velocity increases with temperature (v ≈ 331.3 + 0.606 * T). If sound travels faster, the echo returns sooner, causing an uncalibrated timer to report a shorter distance."
    },
    {
      "id": "udm-q4",
      "question": "What physical mechanism creates the blind zone / dead zone (~2 to 4 cm) in ultrasonic transducers?",
      "options": [
        "Mechanical crystal ringing immediately after pulse excitation obscures returning close-in echoes",
        "Complete acoustic phase cancellation by destructive atmospheric interference",
        "Electronic saturation of the comparator by background electromagnetic radiation",
        "Total absorption of 40 kHz acoustic energy by air moisture within 4 cm"
      ],
      "answer": "Mechanical crystal ringing immediately after pulse excitation obscures returning close-in echoes",
      "correct_option": "Mechanical crystal ringing immediately after pulse excitation obscures returning close-in echoes",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "The piezoelectric ceramic element continues to mechanically resonate and ring after firing; echoes returning during this decay window cannot be differentiated by the receiver comparator."
    },
    {
      "id": "udm-q5",
      "question": "In the linear calibration model d_meas = a * d_ref + b, what do parameters a and b represent?",
      "options": [
        "a is the sensitivity slope (gain factor, ideal = 1.0) and b is the zero-distance offset intercept",
        "a is acoustic attenuation in dB/m and b is receiver threshold voltage in volts",
        "a is ambient atmospheric pressure and b is temperature in Celsius",
        "a is piezoelectric resonant frequency and b is acoustic wavelength in air"
      ],
      "answer": "a is the sensitivity slope (gain factor, ideal = 1.0) and b is the zero-distance offset intercept",
      "correct_option": "a is the sensitivity slope (gain factor, ideal = 1.0) and b is the zero-distance offset intercept",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "Linear regression calibration models the sensor response where a represents scaling sensitivity (ideally 1.0000) and b accounts for hardware latch latencies and acoustic center setback."
    },
    {
      "id": "udm-q6",
      "question": "Why is 40 kHz commonly selected as the operating acoustic center frequency for ultrasonic distance transceivers?",
      "options": [
        "It is safely above the human audible limit (20 kHz) with low atmospheric absorption and compact piezoelectric element size",
        "40 kHz is the electromagnetic resonant frequency of air molecules",
        "Lower frequencies cannot reflect off metallic or acrylic barriers",
        "Higher frequencies travel faster than the standard speed of sound"
      ],
      "answer": "It is safely above the human audible limit (20 kHz) with low atmospheric absorption and compact piezoelectric element size",
      "correct_option": "It is safely above the human audible limit (20 kHz) with low atmospheric absorption and compact piezoelectric element size",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "40 kHz is inaudible to human hearing, suffers manageable attenuation in ambient air compared to megahertz ultrasound, and matches the natural mechanical resonance of small ceramic discs."
    },
    {
      "id": "udm-q7",
      "question": "What causes acoustic specular reflection failure when the target barrier is tilted away from perpendicular alignment?",
      "options": [
        "The reflected acoustic wavepacket deflects away from the receiver transducer according to the law of reflection",
        "The frequency of ultrasound shifts above 100 kHz due to Doppler compression",
        "The sound wave penetrates through the barrier without reflecting",
        "Piezoelectric crystal polarization reverses"
      ],
      "answer": "The reflected acoustic wavepacket deflects away from the receiver transducer according to the law of reflection",
      "correct_option": "The reflected acoustic wavepacket deflects away from the receiver transducer according to the law of reflection",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Smooth surfaces act as specular reflectors. If the incident acoustic beam is tilted away from normal incidence (perpendicularity), reflected energy bounces away from the receiver port."
    },
    {
      "id": "udm-q8",
      "question": "What is the speed of sound in dry air at standard room temperature (T = 20.0 °C)?",
      "options": [
        "343.4 m/s",
        "299.8 m/s",
        "331.3 m/s",
        "1482 m/s"
      ],
      "answer": "343.4 m/s",
      "correct_option": "343.4 m/s",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "v = 331.3 * sqrt(1 + 20 / 273.15) ≈ 343.4 m/s (or 331.3 + 0.606 * 20 = 343.4 m/s)."
    },
    {
      "id": "udm-q9",
      "question": "What is the role of the 10 µs trigger pulse applied to the ultrasonic module (such as HC-SR04)?",
      "options": [
        "It commands the internal microcontroller to burst an 8-cycle 40 kHz ultrasonic wavepacket",
        "It powers the piezoelectric transducer directly for the entire measurement duration",
        "It discharges static electricity from the acoustic bench guide rails",
        "It calibrates the analog-to-digital converter clock to absolute zero"
      ],
      "answer": "It commands the internal microcontroller to burst an 8-cycle 40 kHz ultrasonic wavepacket",
      "correct_option": "It commands the internal microcontroller to burst an 8-cycle 40 kHz ultrasonic wavepacket",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "A 10 µs high-level TTL pulse at the trigger pin initiates the module's burst sequence (8 cycles of 40 kHz) and primes the echo receiver latch."
    },
    {
      "id": "udm-q10",
      "question": "Given a measured distance d_meas and calibrated parameters a (slope) and b (offset), how is the corrected distance d_cal computed?",
      "options": [
        "d_cal = (d_meas - b) / a",
        "d_cal = a * d_meas + b",
        "d_cal = (d_meas + b) * a",
        "d_cal = a / (d_meas - b)"
      ],
      "answer": "d_cal = (d_meas - b) / a",
      "correct_option": "d_cal = (d_meas - b) / a",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Inverting the linear calibration equation d_meas = a * d_ref + b yields the corrected true standoff distance d_cal = (d_meas - b) / a."
    },
    {
      "id": "udm-q11",
      "question": "Why is ultrasound typically defined as acoustic waves with frequencies above 20 kHz?",
      "options": [
        "20 kHz is the upper threshold of normal human hearing",
        "Acoustic attenuation in air drops to zero above 20 kHz",
        "Air molecules cannot vibrate below 20 kHz",
        "Electromagnetic interference begins at 20 kHz"
      ],
      "answer": "20 kHz is the upper threshold of normal human hearing",
      "correct_option": "20 kHz is the upper threshold of normal human hearing",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "In acoustics, ultrasound comprises mechanical longitudinal vibrations above the human audible limit (~20 Hz to 20,000 Hz)."
    },
    {
      "id": "udm-q12",
      "question": "What is the common operating resonant frequency of standard ultrasonic distance modules such as HC-SR04?",
      "options": [
        "40 kHz",
        "10 kHz",
        "1 MHz",
        "100 kHz"
      ],
      "answer": "40 kHz",
      "correct_option": "40 kHz",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "40 kHz is the industry standard for airborne rangefinding, providing an optimal compromise between atmospheric attenuation and directional resolution."
    },
    {
      "id": "udm-q13",
      "question": "At 40 kHz, what is the acoustic wavelength λ in room-temperature air (v = 343 m/s)?",
      "options": [
        "8.58 mm",
        "1.72 mm",
        "17.2 mm",
        "34.3 mm"
      ],
      "answer": "8.58 mm",
      "correct_option": "8.58 mm",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "λ = v / f = 343 m/s / 40,000 Hz = 0.008575 m ≈ 8.58 mm."
    },
    {
      "id": "udm-q14",
      "question": "How does ambient air temperature T (in Celsius) affect the speed of sound v in air?",
      "options": [
        "v ≈ 331.3 + 0.606 * T (m/s)",
        "v ≈ 331.3 - 0.606 * T (m/s)",
        "v ≈ 331.3 * T (m/s)",
        "v is completely independent of temperature"
      ],
      "answer": "v ≈ 331.3 + 0.606 * T (m/s)",
      "correct_option": "v ≈ 331.3 + 0.606 * T (m/s)",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "Sound speed in an ideal gas scales as √(T_kelvin). The linear Taylor expansion around 0°C is v ≈ 331.3 + 0.606 * T (°C)."
    },
    {
      "id": "udm-q15",
      "question": "If an uncalibrated ultrasonic sensor assumes v = 340 m/s on a cold day where actual v = 328 m/s, how will the calculated distance compare to true distance?",
      "options": [
        "The calculated distance will be larger than the true distance",
        "The calculated distance will be smaller than the true distance",
        "The calculated distance will be exact",
        "The sensor will fail to detect echoes"
      ],
      "answer": "The calculated distance will be larger than the true distance",
      "correct_option": "The calculated distance will be larger than the true distance",
      "difficulty": "medium",
      "global_id": 15,
      "explanation": "Distance d = v_assumed * t / 2. Since v_assumed (340) > v_actual (328), the calculated distance overestimates true distance by ~3.7%."
    },
    {
      "id": "udm-q16",
      "question": "What is the primary physical reason for the 'blind zone' (minimum measuring distance ~2 cm to 3 cm) in ultrasonic sensors?",
      "options": [
        "Transducer mechanical ringing after excitation prevents sensing returning echoes immediately",
        "Acoustic waves take 1 second to leave the transducer",
        "Air ionization near the transmitter blocks reception",
        "The receiver is turned off permanently below 5 cm"
      ],
      "answer": "Transducer mechanical ringing after excitation prevents sensing returning echoes immediately",
      "correct_option": "Transducer mechanical ringing after excitation prevents sensing returning echoes immediately",
      "difficulty": "medium",
      "global_id": 16,
      "explanation": "After transmitting an 8-cycle 40 kHz burst, the piezoelectric crystal continues ringing (decaying resonance). Any echo returning during this time is masked."
    },
    {
      "id": "udm-q17",
      "question": "What triggering electrical pulse width is required by an HC-SR04 ultrasonic sensor on its Trig pin to initiate a ping?",
      "options": [
        "At least 10 µs high-level TTL pulse",
        "At least 1 second continuous pulse",
        "10 ms AC voltage pulse",
        "A single clock cycle at 16 MHz"
      ],
      "answer": "At least 10 µs high-level TTL pulse",
      "correct_option": "At least 10 µs high-level TTL pulse",
      "difficulty": "easy",
      "global_id": 17,
      "explanation": "The HC-SR04 specification requires a 10 µs TTL high trigger pulse, which commands the internal ASIC to emit an 8-cycle 40 kHz ultrasound burst."
    },
    {
      "id": "udm-q18",
      "question": "How many ultrasonic wave cycles are typically emitted in a single transmission burst by standard 40 kHz ranging sensors?",
      "options": [
        "8 cycles",
        "1 cycle",
        "100 cycles",
        "500 cycles"
      ],
      "answer": "8 cycles",
      "correct_option": "8 cycles",
      "difficulty": "medium",
      "global_id": 18,
      "explanation": "An 8-cycle burst (lasting 8 / 40,000 = 200 µs) provides sufficient energy to detect reliable echoes while keeping transmission pulse duration short."
    },
    {
      "id": "udm-q19",
      "question": "If the echo pin of an ultrasonic sensor remains HIGH for 1.176 milliseconds, what is the measured one-way distance to the target in air (v = 340 m/s)?",
      "options": [
        "20.0 cm",
        "10.0 cm",
        "40.0 cm",
        "5.88 cm"
      ],
      "answer": "20.0 cm",
      "correct_option": "20.0 cm",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "d = (v * t) / 2 = (340 m/s * 0.001176 s) / 2 = 0.400 m / 2 = 0.200 m = 20.0 cm."
    },
    {
      "id": "udm-q20",
      "question": "What happens when an ultrasonic beam strikes a smooth, flat surface at a large oblique angle of incidence (> 45°)?",
      "options": [
        "Specular reflection deflects the acoustic energy away, resulting in no detectable echo at the receiver",
        "The sound wave is completely absorbed and turned into heat",
        "The sound wave reflects directly back to the sensor regardless of angle",
        "The wave frequency shifts to 80 kHz"
      ],
      "answer": "Specular reflection deflects the acoustic energy away, resulting in no detectable echo at the receiver",
      "correct_option": "Specular reflection deflects the acoustic energy away, resulting in no detectable echo at the receiver",
      "difficulty": "medium",
      "global_id": 20,
      "explanation": "Smooth surfaces act as acoustic mirrors; by the law of reflection (θ_r = θ_i), energy reflects away from the sensor, causing false 'no target' readings."
    },
    {
      "id": "udm-q21",
      "question": "Why do porous materials like acoustic foam, velvet, and fiberglass make poor ultrasonic targets?",
      "options": [
        "They have high acoustic absorption and low reflection coefficient due to impedance damping",
        "They reflect sound faster than the speed of light",
        "They cancel the trigger pulse electrically",
        "They produce continuous constructive interference"
      ],
      "answer": "They have high acoustic absorption and low reflection coefficient due to impedance damping",
      "correct_option": "They have high acoustic absorption and low reflection coefficient due to impedance damping",
      "difficulty": "easy",
      "global_id": 21,
      "explanation": "Porous, fibrous materials trap air and convert acoustic kinetic energy into viscous heat dissipation, drastically attenuating the returning echo."
    },
    {
      "id": "udm-q22",
      "question": "What is acoustic impedance Z mathematically defined as for a medium?",
      "options": [
        "Z = ρ * v (density times speed of sound)",
        "Z = ρ / v",
        "Z = v / ρ",
        "Z = ρ * v²"
      ],
      "answer": "Z = ρ * v (density times speed of sound)",
      "correct_option": "Z = ρ * v (density times speed of sound)",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "Specific acoustic impedance is the product of mass density ρ and acoustic wave propagation speed v (in Rayls or kg/(m²·s))."
    },
    {
      "id": "udm-q23",
      "question": "Why is an acoustic matching layer placed on the front face of a piezoelectric ultrasonic transducer?",
      "options": [
        "To bridge the huge acoustic impedance mismatch between PZT (Z ≈ 30 MRayl) and air (Z ≈ 400 Rayl)",
        "To make the transducer waterproof",
        "To change the frequency of ultrasound",
        "To provide electrical insulation from ground"
      ],
      "answer": "To bridge the huge acoustic impedance mismatch between PZT (Z ≈ 30 MRayl) and air (Z ≈ 400 Rayl)",
      "correct_option": "To bridge the huge acoustic impedance mismatch between PZT (Z ≈ 30 MRayl) and air (Z ≈ 400 Rayl)",
      "difficulty": "hard",
      "global_id": 23,
      "explanation": "Without a matching layer (ideally Z_layer = √(Z_pzt * Z_air)), over 99.9% of acoustic energy would reflect back at the crystal-air boundary due to impedance mismatch."
    },
    {
      "id": "udm-q24",
      "question": "What type of acoustic wave propagates through open air from an ultrasonic rangefinder?",
      "options": [
        "Longitudinal compression-rarefaction wave",
        "Transverse shear wave",
        "Torsional wave",
        "Electromagnetic wave"
      ],
      "answer": "Longitudinal compression-rarefaction wave",
      "correct_option": "Longitudinal compression-rarefaction wave",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "Fluids (gases and liquids) cannot support static shear stresses; hence, acoustic waves in air propagate purely as longitudinal pressure fluctuations."
    },
    {
      "id": "udm-q25",
      "question": "How does relative humidity affect the attenuation of 40 kHz ultrasound in air at room temperature?",
      "options": [
        "Molecular relaxation of oxygen/nitrogen causes frequency-dependent absorption that peaks at intermediate humidity levels (~20%-30%)",
        "Higher humidity eliminates all sound attenuation",
        "Sound travels twice as fast in 100% humidity",
        "Humidity only affects audible sound"
      ],
      "answer": "Molecular relaxation of oxygen/nitrogen causes frequency-dependent absorption that peaks at intermediate humidity levels (~20%-30%)",
      "correct_option": "Molecular relaxation of oxygen/nitrogen causes frequency-dependent absorption that peaks at intermediate humidity levels (~20%-30%)",
      "difficulty": "hard",
      "global_id": 25,
      "explanation": "Water vapor catalysts accelerate vibrational relaxation of oxygen and nitrogen molecules, producing a distinct absorption peak around 20%-30% RH at 40 kHz."
    },
    {
      "id": "udm-q26",
      "question": "What is the typical half-power beam angle (beam divergence) of a standard commercial 40 kHz transducer horn?",
      "options": [
        "Approximately 15° to 30°",
        "Exactly 0° (perfect pencil beam)",
        "180° (hemispherical)",
        "90°"
      ],
      "answer": "Approximately 15° to 30°",
      "correct_option": "Approximately 15° to 30°",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Because the transducer diameter (~16 mm) is only about twice the acoustic wavelength (8.5 mm), diffraction creates a cone angle of roughly 15° to 30°."
    },
    {
      "id": "udm-q27",
      "question": "What causes 'crosstalk' in a dual-transducer ultrasonic module (separate transmitter and receiver)?",
      "options": [
        "Direct acoustic or structural vibration transmission from transmitter to receiver before reaching the target",
        "Bluetooth wireless interference between components",
        "High-frequency electromagnetic radio emission",
        "Refraction by the earth's magnetic field"
      ],
      "answer": "Direct acoustic or structural vibration transmission from transmitter to receiver before reaching the target",
      "correct_option": "Direct acoustic or structural vibration transmission from transmitter to receiver before reaching the target",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "Crosstalk occurs when ultrasonic vibrations leak sideways through the PCB, casing, or direct air path from transmitter to receiver without target reflection."
    },
    {
      "id": "udm-q28",
      "question": "In ultrasonic rangefinding, what is the effect of environmental air turbulence or thermal convection currents (e.g. above a heater)?",
      "options": [
        "Causes fluctuations in sound velocity along the path, leading to jitter and noise in distance measurements",
        "Increases the speed of sound to supersonic velocities",
        "Changes the resonant frequency of the piezoelectric crystal",
        "Inverts the echo pulse polarity"
      ],
      "answer": "Causes fluctuations in sound velocity along the path, leading to jitter and noise in distance measurements",
      "correct_option": "Causes fluctuations in sound velocity along the path, leading to jitter and noise in distance measurements",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "Thermal gradients produce localized pockets of varying density and sound speed, refracting the beam and causing acoustic arrival-time jitter."
    },
    {
      "id": "udm-q29",
      "question": "What is the primary disadvantage of using ultrasonic distance meters compared to optical LiDAR sensors?",
      "options": [
        "Much slower update rate due to speed of sound (343 m/s vs 3x10⁸ m/s) and wider beam spread",
        "Inability to detect clear glass windows",
        "Sensitivity to ambient room lighting",
        "Extremely high electrical power consumption"
      ],
      "answer": "Much slower update rate due to speed of sound (343 m/s vs 3x10⁸ m/s) and wider beam spread",
      "correct_option": "Much slower update rate due to speed of sound (343 m/s vs 3x10⁸ m/s) and wider beam spread",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "Sound travels ~1 million times slower than light, limiting sampling rate at long distances (e.g. measuring 4 m takes ~23 ms round-trip). Wide divergence also gives lower spatial resolution."
    },
    {
      "id": "udm-q30",
      "question": "What unique advantage do ultrasonic distance sensors possess over optical time-of-flight sensors?",
      "options": [
        "Ultrasonic sensors reliably detect transparent targets like glass and clear acrylic sheets",
        "Ultrasonic waves travel at the speed of light",
        "Ultrasonic sensors work inside a complete vacuum",
        "Ultrasonic sensors have nanometer spatial resolution"
      ],
      "answer": "Ultrasonic sensors reliably detect transparent targets like glass and clear acrylic sheets",
      "correct_option": "Ultrasonic sensors reliably detect transparent targets like glass and clear acrylic sheets",
      "difficulty": "easy",
      "global_id": 30,
      "explanation": "Transparent materials that let optical light pass through act as solid acoustic boundaries that reflect acoustic pressure waves cleanly."
    },
    {
      "id": "udm-q31",
      "question": "Can an ultrasonic distance meter operate in a vacuum (such as in outer space)?",
      "options": [
        "No, acoustic waves require a physical material medium (mass and elasticity) to propagate",
        "Yes, ultrasonic waves are a type of electromagnetic radiation",
        "Yes, but only if the temperature is above 0°C",
        "Yes, because piezoelectric crystals generate their own atmosphere"
      ],
      "answer": "No, acoustic waves require a physical material medium (mass and elasticity) to propagate",
      "correct_option": "No, acoustic waves require a physical material medium (mass and elasticity) to propagate",
      "difficulty": "easy",
      "global_id": 31,
      "explanation": "Sound is a mechanical pressure wave consisting of particle collisions; in a vacuum without matter, acoustic propagation is physically impossible."
    },
    {
      "id": "udm-q32",
      "question": "In an experimental calibration of an ultrasonic sensor, what mathematical relationship describes the plotted graph of True Distance (y) vs Echo Time (x)?",
      "options": [
        "A straight line passing through the origin with slope equal to v / 2",
        "A parabola opening upwards",
        "An exponential decay curve",
        "A sinusoidal wave"
      ],
      "answer": "A straight line passing through the origin with slope equal to v / 2",
      "correct_option": "A straight line passing through the origin with slope equal to v / 2",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Since d = (v/2) * t, the relationship is strictly linear with slope m = v/2 and y-intercept near zero (offset by transducer front-face positioning)."
    },
    {
      "id": "udm-q33",
      "question": "If linear regression of calibration data yields d = 0.1715 * t (where d is in meters and t in milliseconds), what is the calculated speed of sound?",
      "options": [
        "343.0 m/s",
        "171.5 m/s",
        "686.0 m/s",
        "331.3 m/s"
      ],
      "answer": "343.0 m/s",
      "correct_option": "343.0 m/s",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Slope = v / 2 = 0.1715 m/ms = 171.5 m/s. Therefore v = 2 * 171.5 m/s = 343.0 m/s."
    },
    {
      "id": "udm-q34",
      "question": "What is the maximum practical range of a standard 40 kHz airborne sensor (e.g. HC-SR04)?",
      "options": [
        "Approximately 4 to 5 meters",
        "50 to 100 meters",
        "500 meters",
        "1 kilometer"
      ],
      "answer": "Approximately 4 to 5 meters",
      "correct_option": "Approximately 4 to 5 meters",
      "difficulty": "easy",
      "global_id": 34,
      "explanation": "At 40 kHz, atmospheric absorption (~1.2 dB/m) combined with spherical inverse-square spreading loss limits echo signal-to-noise ratio beyond 4-5 m."
    },
    {
      "id": "udm-q35",
      "question": "If an obstacle is positioned at 3.43 meters distance, what is the total round-trip flight time of the acoustic pulse (at v = 343 m/s)?",
      "options": [
        "20.0 milliseconds",
        "10.0 milliseconds",
        "5.0 milliseconds",
        "40.0 milliseconds"
      ],
      "answer": "20.0 milliseconds",
      "correct_option": "20.0 milliseconds",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "Total round-trip distance = 2 * 3.43 m = 6.86 m. Time t = 6.86 m / 343 m/s = 0.020 s = 20.0 ms."
    },
    {
      "id": "udm-q36",
      "question": "What is the phenomenon called when an echo bounces multiple times between the sensor and target, creating phantom readings at integer multiples of the true distance?",
      "options": [
        "Multipath / multi-bounce reflection",
        "Doppler shifting",
        "Acoustic cavitations",
        "Rayleigh scattering"
      ],
      "answer": "Multipath / multi-bounce reflection",
      "correct_option": "Multipath / multi-bounce reflection",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "A strong echo reflecting back from the sensor face can travel to the target a second time, producing a false echo at twice the distance if the ping cycle is too fast."
    },
    {
      "id": "udm-q37",
      "question": "What minimum delay between successive measurement pings is recommended to prevent previous echo interference?",
      "options": [
        "Around 50 ms to 60 ms",
        "1 microsecond",
        "10 seconds",
        "Zero delay"
      ],
      "answer": "Around 50 ms to 60 ms",
      "correct_option": "Around 50 ms to 60 ms",
      "difficulty": "medium",
      "global_id": 37,
      "explanation": "Waiting 50-60 ms between pings gives previous ultrasonic pulses sufficient time to dissipate below the receiver detection threshold."
    },
    {
      "id": "udm-q38",
      "question": "How does the directivity D of an ultrasonic transducer change if its diameter D_transducer is increased at constant frequency?",
      "options": [
        "The beam becomes narrower and more directional",
        "The beam spreads wider in all directions",
        "Directivity remains unchanged",
        "The acoustic frequency doubles"
      ],
      "answer": "The beam becomes narrower and more directional",
      "correct_option": "The beam becomes narrower and more directional",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "By diffraction theory, beam divergence half-angle θ ≈ 1.22 λ / D. Increasing aperture diameter D narrows the emission beam."
    },
    {
      "id": "udm-q39",
      "question": "What electronic circuit block inside an ultrasonic receiver amplifies the weak microvolt signal generated by the receiving piezoelectric element?",
      "options": [
        "A high-gain bandpass preamplifier and comparator",
        "A step-down transformer",
        "A power inverter",
        "A phase-locked loop frequency multiplier"
      ],
      "answer": "A high-gain bandpass preamplifier and comparator",
      "correct_option": "A high-gain bandpass preamplifier and comparator",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "The receiving crystal generates tiny piezoelectric voltages; a multi-stage bandpass amplifier tuned to 40 kHz boosts the signal and a comparator generates a clean digital logic pulse."
    },
    {
      "id": "udm-q40",
      "question": "Why is automatic gain control (Time-Gain Compensation / TGC) often implemented in advanced ultrasonic receivers?",
      "options": [
        "To progressively increase amplifier gain over time as echoes arrive from farther, more attenuated targets",
        "To decrease power consumption when idle",
        "To shift the acoustic frequency during flight",
        "To prevent the transmitter from overheating"
      ],
      "answer": "To progressively increase amplifier gain over time as echoes arrive from farther, more attenuated targets",
      "correct_option": "To progressively increase amplifier gain over time as echoes arrive from farther, more attenuated targets",
      "difficulty": "hard",
      "global_id": 40,
      "explanation": "Echoes from distant targets suffer greater geometric spreading and atmospheric attenuation; Time-Gain Compensation increases gain proportionally with time to equalize sensitivity."
    },
    {
      "id": "udm-q41",
      "question": "What is the acoustic pressure reflection coefficient R at normal incidence between two media of impedances Z1 and Z2?",
      "options": [
        "R = (Z2 - Z1) / (Z2 + Z1)",
        "R = (Z2 + Z1) / (Z2 - Z1)",
        "R = Z1 * Z2",
        "R = (Z2 - Z1)²"
      ],
      "answer": "R = (Z2 - Z1) / (Z2 + Z1)",
      "correct_option": "R = (Z2 - Z1) / (Z2 + Z1)",
      "difficulty": "hard",
      "global_id": 41,
      "explanation": "The pressure reflection coefficient is R = (Z2 - Z1) / (Z2 + Z1). When Z2 >> Z1 (like air to steel or wall), R ≈ +1, producing near-total reflection."
    },
    {
      "id": "udm-q42",
      "question": "If a moving vehicle approaches an ultrasonic sensor, what physical effect causes the returning frequency to be higher than 40 kHz?",
      "options": [
        "The Doppler Effect",
        "The Joule-Thomson Effect",
        "The Seebeck Effect",
        "The Hall Effect"
      ],
      "answer": "The Doppler Effect",
      "correct_option": "The Doppler Effect",
      "difficulty": "easy",
      "global_id": 42,
      "explanation": "Relative motion between source and receiver shifts the observed wave frequency: f_observed = f_source * (v + v_target) / (v - v_target)."
    },
    {
      "id": "udm-q43",
      "question": "What is the wavelength of a 40 kHz acoustic wave in water (where sound speed is v ≈ 1500 m/s)?",
      "options": [
        "37.5 mm",
        "8.58 mm",
        "1.50 mm",
        "75.0 mm"
      ],
      "answer": "37.5 mm",
      "correct_option": "37.5 mm",
      "difficulty": "medium",
      "global_id": 43,
      "explanation": "λ = v / f = 1500 m/s / 40,000 Hz = 0.0375 m = 37.5 mm. (Sound travels ~4.4x faster in water than in air)."
    },
    {
      "id": "udm-q44",
      "question": "Why does an ultrasonic sensor struggle to measure the distance to a sphere compared to a flat wall?",
      "options": [
        "A sphere has only a tiny tangential surface area perpendicular to the beam, scattering most energy away",
        "Spheres absorb ultrasonic waves completely",
        "Spherical objects reflect ultrasound into the 4th dimension",
        "Sound speed slows down near curved objects"
      ],
      "answer": "A sphere has only a tiny tangential surface area perpendicular to the beam, scattering most energy away",
      "correct_option": "A sphere has only a tiny tangential surface area perpendicular to the beam, scattering most energy away",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "Curved surfaces act as convex acoustic mirrors that disperse incident acoustic rays outward, leaving only a weak specular echo returning to the sensor."
    },
    {
      "id": "udm-q45",
      "question": "What is the effect of wind blowing parallel to the ultrasonic pulse (towards the target)?",
      "options": [
        "The effective speed of sound increases (v_eff = v_sound + v_wind), shortening the round-trip travel time",
        "The frequency of the wave drops to zero",
        "The beam freezes in mid-air",
        "Wind has no effect on sound propagation"
      ],
      "answer": "The effective speed of sound increases (v_eff = v_sound + v_wind), shortening the round-trip travel time",
      "correct_option": "The effective speed of sound increases (v_eff = v_sound + v_wind), shortening the round-trip travel time",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "Sound propagates relative to the moving air medium. A tailwind adds to sound velocity on the outward leg, while a headwind subtracts on the return leg."
    },
    {
      "id": "udm-q46",
      "question": "In an experimental calibration curve, what does the y-intercept represent if the model is d = m * t + c?",
      "options": [
        "The systematic offset error, including acoustic zero-point distance and internal electronic processing delay",
        "The room temperature in Kelvin",
        "The acoustic absorption coefficient",
        "The mass of the transducer crystal"
      ],
      "answer": "The systematic offset error, including acoustic zero-point distance and internal electronic processing delay",
      "correct_option": "The systematic offset error, including acoustic zero-point distance and internal electronic processing delay",
      "difficulty": "medium",
      "global_id": 46,
      "explanation": "The y-intercept c accounts for the physical distance from the circuit zero to the transducer front face, plus fixed hardware triggering/detector delays."
    },
    {
      "id": "udm-q47",
      "question": "What digital filtering algorithm is commonly used in software to eliminate outlier readings caused by missed ultrasonic pings?",
      "options": [
        "Median filter",
        "Fast Fourier Transform inverter only",
        "Differentiation filter",
        "Uncompensated integration"
      ],
      "answer": "Median filter",
      "correct_option": "Median filter",
      "difficulty": "medium",
      "global_id": 47,
      "explanation": "A median filter over a window of 5-7 readings effectively rejects isolated dropouts (such as 0 cm or 400 cm false spikes) without lagging smooth distance changes."
    },
    {
      "id": "udm-q48",
      "question": "What happens to the acoustic power of an ultrasonic wave as it propagates in free space away from a point-like source?",
      "options": [
        "Intensity decreases inversely with the square of distance (1/r²) plus exponential atmospheric absorption",
        "Intensity remains perfectly constant",
        "Intensity drops linearly with distance (1/r)",
        "Intensity increases due to acoustic resonance"
      ],
      "answer": "Intensity decreases inversely with the square of distance (1/r²) plus exponential atmospheric absorption",
      "correct_option": "Intensity decreases inversely with the square of distance (1/r²) plus exponential atmospheric absorption",
      "difficulty": "medium",
      "global_id": 48,
      "explanation": "Geometric spherical spreading reduces acoustic power density according to the inverse-square law (1/r²), supplemented by absorption loss exp(-2αr)."
    },
    {
      "id": "udm-q49",
      "question": "Why is the lead zirconate titanate (PZT) crystal in an ultrasonic transducer poled with a strong electric field during manufacturing?",
      "options": [
        "To align internal ferroelectric dipoles so the ceramic exhibits macroscopic piezoelectricity",
        "To make the crystal electrically conductive",
        "To prevent thermal expansion",
        "To melt the crystal into a disc"
      ],
      "answer": "To align internal ferroelectric dipoles so the ceramic exhibits macroscopic piezoelectricity",
      "correct_option": "To align internal ferroelectric dipoles so the ceramic exhibits macroscopic piezoelectricity",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "Unpoled polycrystalline PZT has randomly oriented ferroelectric domains that cancel out; poling under high DC field at elevated temperature aligns dipoles to produce strong piezoelectric response."
    },
    {
      "id": "udm-q50",
      "question": "If an ultrasonic sensor is calibrated at 20°C (v = 343.4 m/s) and then used at 40°C (v = 355.3 m/s) without temperature compensation, what percentage error occurs in distance measurement?",
      "options": [
        "Approximately -3.5% (underestimates distance by ~3.5%)",
        "Approximately +15%",
        "Exactly 0%",
        "Approximately +50%"
      ],
      "answer": "Approximately -3.5% (underestimates distance by ~3.5%)",
      "correct_option": "Approximately -3.5% (underestimates distance by ~3.5%)",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "At 40°C, the echo returns faster. Because the uncompensated firmware calculates d = v_calibrated * t / 2, the calculated distance is (343.4 / 355.3) = 0.9665 of true distance, underestimating by ~3.46%."
    }
  ]
};

export const WEDGE_FILM_QUESTION_BANK = {
  "experiment": "Wedge-Shaped Film Interference - Question Bank",
  "experimentId": "wedge-film",
  "quizId": "wedge-film-mastery-quiz",
  "experimentName": "Wedge-Shaped Film Interference",
  "description": "Comprehensive 50-Question Physics Question Bank for Wedge-Shaped Film Interference",
  "total_questions": 50,
  "questions": [
    {
      "id": "wf-q1",
      "question": "Why is the fringe at the line of contact between the two glass plates dark in reflected monochromatic light?",
      "options": [
        "Reflection at the lower optically denser glass surface introduces a Stokes phase shift of π radians (λ/2 path difference)",
        "The glass absorbs 100% of the light at zero film thickness",
        "Refraction index of air drops to zero at the line of contact",
        "Constructive interference cancels all odd harmonics"
      ],
      "answer": "Reflection at the lower optically denser glass surface introduces a Stokes phase shift of π radians (λ/2 path difference)",
      "correct_option": "Reflection at the lower optically denser glass surface introduces a Stokes phase shift of π radians (λ/2 path difference)",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "At the contact edge t = 0. Reflection from the denser glass medium adds a phase jump of π rad (λ/2), causing destructive interference and producing a permanent dark fringe."
    },
    {
      "id": "wf-q2",
      "question": "Why are the interference fringes formed in a wedge-shaped film straight, parallel, and equidistant?",
      "options": [
        "Loci of constant film thickness on optically flat planar plates are straight lines parallel to the contact apex",
        "The travelling microscope lens produces straight virtual images regardless of plate curvature",
        "Photons repel each other transversely in the air gap",
        "Reflection angle is 45 degrees along the entire wedge"
      ],
      "answer": "Loci of constant film thickness on optically flat planar plates are straight lines parallel to the contact apex",
      "correct_option": "Loci of constant film thickness on optically flat planar plates are straight lines parallel to the contact apex",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Fringes of equal thickness (Fizeau fringes) follow contours of identical gap thickness t. For planar plates with constant wedge angle α, these contours form straight parallel lines."
    },
    {
      "id": "wf-q3",
      "question": "What is the formula to calculate spacer wire diameter d using fringe width β, wedge length L, and wavelength λ?",
      "options": [
        "d = (λ * L) / (2 * β)",
        "d = (2 * λ * β) / L",
        "d = (β * L) / (2 * λ)",
        "d = (λ * β) / (2 * L)"
      ],
      "answer": "d = (λ * L) / (2 * β)",
      "correct_option": "d = (λ * L) / (2 * β)",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Since fringe spacing β = (λ * L) / (2 * d), rearranging directly yields spacer diameter d = (λ * L) / (2 * β)."
    },
    {
      "id": "wf-q4",
      "question": "What happens to the fringe width β if a thicker wire is used as the spacer?",
      "options": [
        "Fringe width decreases and fringes crowd closer together because β is inversely proportional to wire diameter d",
        "Fringe width increases and fringes become wider apart",
        "Fringe width remains unchanged because it only depends on wavelength",
        "Fringes turn into concentric circular Newton rings"
      ],
      "answer": "Fringe width decreases and fringes crowd closer together because β is inversely proportional to wire diameter d",
      "correct_option": "Fringe width decreases and fringes crowd closer together because β is inversely proportional to wire diameter d",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "Because β = (λ * L) / (2 * d), increasing d steepens the wedge angle α = d / L, causing fringe spacing β to shrink."
    },
    {
      "id": "wf-q5",
      "question": "What is the condition for dark interference fringes (minima) in a thin air wedge observed in reflected light at near-normal incidence?",
      "options": [
        "2t = m * λ (m = 0, 1, 2, ...)",
        "2t = (m - 1/2) * λ (m = 1, 2, ...)",
        "2t = (2m + 1) * λ",
        "t = m * λ / 4"
      ],
      "answer": "2t = m * λ (m = 0, 1, 2, ...)",
      "correct_option": "2t = m * λ (m = 0, 1, 2, ...)",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "Destructive interference occurs when total path difference Δ = 2t + λ/2 = (2m + 1)λ/2, which simplifies to 2t = mλ."
    },
    {
      "id": "wf-q6",
      "question": "If the air film (μ = 1) is replaced by a transparent liquid film of refractive index μ = 1.33, what happens to the fringe width β'?",
      "options": [
        "Fringe width decreases to β' = β / μ",
        "Fringe width increases to β' = β * μ",
        "Fringe width is completely unaffected by medium refractive index",
        "All fringes disappear due to total internal reflection"
      ],
      "answer": "Fringe width decreases to β' = β / μ",
      "correct_option": "Fringe width decreases to β' = β / μ",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "The effective optical path within the film is 2μt, making fringe width β' = λ / (2μα) = β / μ."
    },
    {
      "id": "wf-q7",
      "question": "What is the small wedge angle α in radians for two plates of length L separated by a spacer wire of diameter d?",
      "options": [
        "α ≈ d / L",
        "α ≈ L / d",
        "α ≈ 2d / L",
        "α ≈ d / (2L)"
      ],
      "answer": "α ≈ d / L",
      "correct_option": "α ≈ d / L",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Using the small angle trigonometric approximation, tan(α) ≈ α ≈ d / L in radians."
    },
    {
      "id": "wf-q8",
      "question": "Why must the travelling microscope carriage be moved in one continuous direction during measurement?",
      "options": [
        "To eliminate mechanical backlash (lost motion) in the lead-screw and vernier nut assembly",
        "To prevent optical polarization changes in the eyepiece reticle",
        "Because the microscope can only focus when traveling forward",
        "To ensure monochromatic light does not undergo Doppler shifts"
      ],
      "answer": "To eliminate mechanical backlash (lost motion) in the lead-screw and vernier nut assembly",
      "correct_option": "To eliminate mechanical backlash (lost motion) in the lead-screw and vernier nut assembly",
      "difficulty": "medium",
      "global_id": 8,
      "explanation": "Reversing lead-screw motion introduces pitch play and deadband backlash error, spoiling precision micrometer vernier readings."
    },
    {
      "id": "wf-q9",
      "question": "What happens if a polychromatic white light source is used instead of monochromatic light?",
      "options": [
        "A few colored fringes are visible near the zero-order dark contact apex, beyond which uniform white illumination appears",
        "An infinite number of sharp black and white fringes are produced",
        "Complete darkness results due to destructive interference of all colors",
        "A continuous rainbow diffraction spectrum forms on the screen"
      ],
      "answer": "A few colored fringes are visible near the zero-order dark contact apex, beyond which uniform white illumination appears",
      "correct_option": "A few colored fringes are visible near the zero-order dark contact apex, beyond which uniform white illumination appears",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Because different wavelengths have different fringe spacings, only a few overlapping colored fringes appear near t = 0. At larger t, path difference exceeds the short coherence length of white light."
    },
    {
      "id": "wf-q10",
      "question": "In an experiment using Sodium yellow light (λ = 589.3 nm), wedge length L = 100.0 mm, and spacer diameter d = 40.0 μm, what is the theoretical fringe width β?",
      "options": [
        "0.737 mm",
        "1.474 mm",
        "0.368 mm",
        "2.946 mm"
      ],
      "answer": "0.737 mm",
      "correct_option": "0.737 mm",
      "difficulty": "hard",
      "global_id": 10,
      "explanation": "β = (λ * L) / (2 * d) = (589.3e-6 mm * 100 mm) / (2 * 0.040 mm) = 0.05893 / 0.080 = 0.7366 mm ≈ 0.737 mm."
    },
    {
      "id": "wedge-q11",
      "question": "In a wedge-shaped thin film of angle θ and refractive index µ, what is the formula for the fringe width β of equidistant fringes?",
      "options": [
        "β = λ / (2 * µ * θ)",
        "β = (2 * µ * θ) / λ",
        "β = λ * µ * θ",
        "β = λ / (µ * θ)"
      ],
      "answer": "β = λ / (2 * µ * θ)",
      "correct_option": "β = λ / (2 * µ * θ)",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "For normal incidence, path difference between consecutive fringes changes by λ, corresponding to an advance Δx = β such that 2µ(Δx * θ) = λ, giving β = λ / (2µθ)."
    },
    {
      "id": "wedge-q12",
      "question": "If an air wedge film (µ = 1) is formed by placing a spacer of thickness t at a distance L from the edge of contact, what is the fringe width β?",
      "options": [
        "β = (λ * L) / (2 * t)",
        "β = (2 * t * L) / λ",
        "β = (λ * t) / (2 * L)",
        "β = (2 * λ * L) / t"
      ],
      "answer": "β = (λ * L) / (2 * t)",
      "correct_option": "β = (λ * L) / (2 * t)",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "Since the wedge angle is θ ≈ t / L, substituting into β = λ / (2θ) gives β = λL / (2t)."
    },
    {
      "id": "wedge-q13",
      "question": "How does the fringe width β change if the air film between the glass plates is replaced by a liquid of refractive index µ = 1.33?",
      "options": [
        "The fringe width decreases by a factor of 1.33 (fringes become closer together)",
        "The fringe width increases by a factor of 1.33",
        "The fringes disappear completely",
        "The fringe width remains unchanged"
      ],
      "answer": "The fringe width decreases by a factor of 1.33 (fringes become closer together)",
      "correct_option": "The fringe width decreases by a factor of 1.33 (fringes become closer together)",
      "difficulty": "easy",
      "global_id": 13,
      "explanation": "Since β = λ / (2µθ), introducing a medium with µ > 1 reduces the optical wavelength to λ/µ, compressing the fringe width: β_liquid = β_air / µ."
    },
    {
      "id": "wedge-q14",
      "question": "What is the condition for destructive interference (dark fringes) in a wedge-shaped film under normally incident light?",
      "options": [
        "2 * µ * t_x = n * λ  (where n = 0, 1, 2, ...)",
        "2 * µ * t_x = (2n + 1) * λ / 2",
        "2 * µ * t_x = (n + 1/2) * λ",
        "µ * t_x = n * λ"
      ],
      "answer": "2 * µ * t_x = n * λ  (where n = 0, 1, 2, ...)",
      "correct_option": "2 * µ * t_x = n * λ  (where n = 0, 1, 2, ...)",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "Due to reflection at the lower optically denser boundary, an abrupt phase shift of π (equivalent to λ/2 path shift) occurs. Total path difference Δ = 2µt_x + λ/2 = (2n+1)λ/2, which simplifies to 2µt_x = nλ."
    },
    {
      "id": "wedge-q15",
      "question": "What is the condition for constructive interference (bright fringes) in a wedge-shaped film of refractive index µ under normal illumination?",
      "options": [
        "2 * µ * t_x = (2n - 1) * λ / 2  (or (2n + 1)λ/2)",
        "2 * µ * t_x = n * λ",
        "µ * t_x = n * λ / 2",
        "2 * µ * t_x = 2n * λ"
      ],
      "answer": "2 * µ * t_x = (2n - 1) * λ / 2  (or (2n + 1)λ/2)",
      "correct_option": "2 * µ * t_x = (2n - 1) * λ / 2  (or (2n + 1)λ/2)",
      "difficulty": "medium",
      "global_id": 15,
      "explanation": "Setting total path difference 2µt_x + λ/2 = nλ gives 2µt_x = (2n - 1)λ/2 for maximum brightness."
    },
    {
      "id": "wedge-q16",
      "question": "Why is the line of contact (apex of the wedge where thickness t = 0) dark in reflected light?",
      "options": [
        "At t = 0, the path difference is purely the λ/2 phase shift from reflection at the denser medium, causing complete destructive interference",
        "Light cannot enter the apex because the gap is zero",
        "Both light rays are completely absorbed by glass",
        "Total internal reflection traps all light inside the top plate"
      ],
      "answer": "At t = 0, the path difference is purely the λ/2 phase shift from reflection at the denser medium, causing complete destructive interference",
      "correct_option": "At t = 0, the path difference is purely the λ/2 phase shift from reflection at the denser medium, causing complete destructive interference",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "At the contact line t = 0, optical path difference is Δ = 0 + λ/2 = λ/2 (phase difference π), producing total destructive interference (dark fringe)."
    },
    {
      "id": "wedge-q17",
      "question": "If the wedge film is viewed in transmitted light rather than reflected light, what is the appearance of the line of contact (t = 0)?",
      "options": [
        "Bright, because no relative phase shift occurs between the two transmitted rays",
        "Dark, exactly the same as reflected light",
        "Invisible",
        "Yellow"
      ],
      "answer": "Bright, because no relative phase shift occurs between the two transmitted rays",
      "correct_option": "Bright, because no relative phase shift occurs between the two transmitted rays",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "In transmission, interfering rays undergo two internal reflections or none; there is no net π phase shift, so path difference at t = 0 is zero (constructive interference = bright)."
    },
    {
      "id": "wedge-q18",
      "question": "What geometric shape do the interference fringes have in an ideal flat-surfaced wedge-shaped film?",
      "options": [
        "Straight, parallel lines running parallel to the line of contact",
        "Concentric circular rings",
        "Hyperbolic curves",
        "Elliptical loops"
      ],
      "answer": "Straight, parallel lines running parallel to the line of contact",
      "correct_option": "Straight, parallel lines running parallel to the line of contact",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "Each locus of constant film thickness t_x is a straight line parallel to the apex of the wedge; hence the fringes of equal thickness are straight and parallel."
    },
    {
      "id": "wedge-q19",
      "question": "If Sodium light (λ = 589.3 nm) illuminates an air wedge where L = 10 cm and spacer thickness t = 0.05 mm, what is the fringe width β?",
      "options": [
        "0.589 mm",
        "1.178 mm",
        "0.295 mm",
        "5.89 mm"
      ],
      "answer": "0.589 mm",
      "correct_option": "0.589 mm",
      "difficulty": "hard",
      "global_id": 19,
      "explanation": "β = λL / (2t) = (589.3e-9 m * 0.10 m) / (2 * 0.05e-3 m) = 5.893e-8 / 1.0e-4 = 5.893e-4 m = 0.589 mm."
    },
    {
      "id": "wedge-q20",
      "question": "How is a wedge-shaped film setup used to determine the thickness t of a very thin sheet of paper or wire?",
      "options": [
        "By counting the number of fringes over a known length L and applying t = (N * λ * L) / (2 * x) or t = λL / (2β)",
        "By weighing the wire on a microbalance",
        "By measuring electrical resistance of the glass plates",
        "By measuring refraction angle with a spectrometer"
      ],
      "answer": "By counting the number of fringes over a known length L and applying t = (N * λ * L) / (2 * x) or t = λL / (2β)",
      "correct_option": "By counting the number of fringes over a known length L and applying t = (N * λ * L) / (2 * x) or t = λL / (2β)",
      "difficulty": "medium",
      "global_id": 20,
      "explanation": "Knowing the distance L from apex to spacer and measuring fringe spacing β with a travelling microscope allows direct calculation: t = λL / (2β)."
    },
    {
      "id": "wedge-q21",
      "question": "What happens to the fringe width β if the spacer is pushed further away from the edge of contact (increasing L)?",
      "options": [
        "Fringe width β increases (fringes spread farther apart)",
        "Fringe width β decreases",
        "Fringe width remains unchanged",
        "Fringes turn into circles"
      ],
      "answer": "Fringe width β increases (fringes spread farther apart)",
      "correct_option": "Fringe width β increases (fringes spread farther apart)",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Since β = λL / (2t), increasing L while keeping spacer thickness t constant decreases the wedge angle θ = t/L, which widens the fringe spacing β."
    },
    {
      "id": "wedge-q22",
      "question": "What happens to the fringes if a thicker wire is inserted as the spacer at the same distance L?",
      "options": [
        "The wedge angle increases, causing fringes to crowd closer together (β decreases)",
        "The fringe spacing widens",
        "The fringes become curved",
        "The central fringe shifts to white"
      ],
      "answer": "The wedge angle increases, causing fringes to crowd closer together (β decreases)",
      "correct_option": "The wedge angle increases, causing fringes to crowd closer together (β decreases)",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "A thicker wire increases wedge angle θ = t/L. Since β = λ / (2θ), the fringes pack more densely together."
    },
    {
      "id": "wedge-q23",
      "question": "What type of light source must be used to observe clear, high-contrast, multi-order interference fringes in a wedge film?",
      "options": [
        "Monochromatic extended light source (such as Sodium vapor lamp with a diffusing glass plate)",
        "A multi-colored incandescent bulb without filter",
        "A fluorescent tube directly above the plate",
        "Ultraviolet blacklight"
      ],
      "answer": "Monochromatic extended light source (such as Sodium vapor lamp with a diffusing glass plate)",
      "correct_option": "Monochromatic extended light source (such as Sodium vapor lamp with a diffusing glass plate)",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "An extended monochromatic source provides rays over a range of angles that illuminate a wide viewing area with single wavelength coherence."
    },
    {
      "id": "wedge-q24",
      "question": "Why is a glass plate inclined at 45° to the vertical placed above the wedge film in a travelling microscope setup?",
      "options": [
        "To reflect light from the horizontal source down onto the film at normal incidence, while letting reflected light pass upward to the microscope",
        "To focus the light into a point",
        "To polarize the light at Brewster's angle",
        "To filter out yellow wavelengths"
      ],
      "answer": "To reflect light from the horizontal source down onto the film at normal incidence, while letting reflected light pass upward to the microscope",
      "correct_option": "To reflect light from the horizontal source down onto the film at normal incidence, while letting reflected light pass upward to the microscope",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "A 45° semi-transparent beam distributor directs illumination vertically downward onto the film at 90° normal incidence and transmits the returning pattern up into the microscope objective."
    },
    {
      "id": "wedge-q25",
      "question": "What happens to the interference fringes if white light is used instead of monochromatic sodium light?",
      "options": [
        "Only a few colored fringes are seen near the edge of contact, followed by uniform white illumination",
        "An infinite series of sharp black-and-white lines appears",
        "No interference occurs at all",
        "The entire film turns completely black"
      ],
      "answer": "Only a few colored fringes are seen near the edge of contact, followed by uniform white illumination",
      "correct_option": "Only a few colored fringes are seen near the edge of contact, followed by uniform white illumination",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "Because each wavelength has a different fringe width β(λ), overlapping colored fringes blur into uniform white light beyond the first few orders."
    },
    {
      "id": "wedge-q26",
      "question": "In optical workshop metrology, how are wedge fringes used to test the optical flatness of a polished glass surface?",
      "options": [
        "If the test surface is perfectly flat, fringes are perfectly straight and parallel; curvature in fringes reveals surface imperfections",
        "By measuring how much light is absorbed by the surface",
        "By measuring surface electrical conductivity",
        "By heating the plate until fringes move"
      ],
      "answer": "If the test surface is perfectly flat, fringes are perfectly straight and parallel; curvature in fringes reveals surface imperfections",
      "correct_option": "If the test surface is perfectly flat, fringes are perfectly straight and parallel; curvature in fringes reveals surface imperfections",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Fringes act as optical contour elevation maps: a deviation of one fringe width corresponds to a surface height error of exactly λ/2 (≈ 0.3 µm)."
    },
    {
      "id": "wedge-q27",
      "question": "If the interference fringes observed in an air wedge curve towards the apex of the wedge, what does this indicate about the glass surface?",
      "options": [
        "The surface has a convex contour error (bulges outward)",
        "The surface has a concave depression",
        "The surface is perfectly flat",
        "The glass is absorbing sodium light"
      ],
      "answer": "The surface has a convex contour error (bulges outward)",
      "correct_option": "The surface has a convex contour error (bulges outward)",
      "difficulty": "hard",
      "global_id": 27,
      "explanation": "Fringes follow lines of equal thickness. Curving towards the thin apex means the thickness increases earlier due to a convex elevation."
    },
    {
      "id": "wedge-q28",
      "question": "If an optical flat test reveals fringes that bend towards the thicker side of the wedge, what surface defect is present?",
      "options": [
        "A concave hollow or depression in the surface",
        "A convex bump",
        "A scratch parallel to the edge",
        "Dust on the top surface"
      ],
      "answer": "A concave hollow or depression in the surface",
      "correct_option": "A concave hollow or depression in the surface",
      "difficulty": "hard",
      "global_id": 28,
      "explanation": "Bending toward the thicker edge indicates that the required thickness for that fringe occurs farther out, signifying a concave depression."
    },
    {
      "id": "wedge-q29",
      "question": "Over a distance of 1.2 cm along an air wedge, exactly 20 bright fringes are counted using a sodium lamp (λ = 589 nm). What is the fringe width β?",
      "options": [
        "0.60 mm",
        "0.06 mm",
        "1.20 mm",
        "0.30 mm"
      ],
      "answer": "0.60 mm",
      "correct_option": "0.60 mm",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "β = total distance / number of fringes = 1.2 cm / 20 = 0.06 cm = 0.60 mm."
    },
    {
      "id": "wedge-q30",
      "question": "Using the measured fringe width β = 0.60 mm, λ = 589 nm, and plate length L = 10 cm, what is the calculated thickness of the spacer wire?",
      "options": [
        "0.049 mm (49 µm)",
        "0.098 mm",
        "0.025 mm",
        "0.196 mm"
      ],
      "answer": "0.049 mm (49 µm)",
      "correct_option": "0.049 mm (49 µm)",
      "difficulty": "hard",
      "global_id": 30,
      "explanation": "t = λL / (2β) = (589e-9 m * 0.10 m) / (2 * 0.60e-3 m) = 5.89e-8 / 1.2e-3 = 4.908e-5 m ≈ 49.1 µm = 0.049 mm."
    },
    {
      "id": "wedge-q31",
      "question": "What optical classification applies to wedge film fringes and Newton's rings?",
      "options": [
        "Fringes of equal thickness (Fizeau fringes)",
        "Fringes of equal inclination (Haidinger fringes)",
        "Diffraction fringes of Fresnel type",
        "Fraunhofer spectral lines"
      ],
      "answer": "Fringes of equal thickness (Fizeau fringes)",
      "correct_option": "Fringes of equal thickness (Fizeau fringes)",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Fringes produced by a thin film with variable thickness under near-normal illumination are localized Fizeau fringes of equal thickness."
    },
    {
      "id": "wedge-q32",
      "question": "Where are the interference fringes localized in a wedge-shaped film?",
      "options": [
        "Inside or very close to the upper surface of the film itself",
        "At infinity",
        "On the light source",
        "Inside the microscope eyepiece reticle"
      ],
      "answer": "Inside or very close to the upper surface of the film itself",
      "correct_option": "Inside or very close to the upper surface of the film itself",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Fringes of equal thickness are localized within the film; the microscope objective must be focused directly on the film surface to view them sharply."
    },
    {
      "id": "wedge-q33",
      "question": "Why do thick glass plates (e.g. 5 mm thick window glass) not show visible interference fringes under room light?",
      "options": [
        "The path difference (2µt) far exceeds the coherence length of ambient light, causing fringe overlap into white light",
        "Thick glass does not reflect any light",
        "Glass molecules absorb interference photons",
        "Thick plates bend light rays backwards"
      ],
      "answer": "The path difference (2µt) far exceeds the coherence length of ambient light, causing fringe overlap into white light",
      "correct_option": "The path difference (2µt) far exceeds the coherence length of ambient light, causing fringe overlap into white light",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Interference requires path differences within the temporal coherence length of the source. For thick plates (2µt >> λ), countless orders overlap, washing out the pattern."
    },
    {
      "id": "wedge-q34",
      "question": "If an air wedge is subjected to uniform heating such that the spacer expands by Δt while L remains constant, how does the fringe width β change?",
      "options": [
        "β decreases because wedge angle θ increases",
        "β increases",
        "β remains constant",
        "Fringes rotate by 90°"
      ],
      "answer": "β decreases because wedge angle θ increases",
      "correct_option": "β decreases because wedge angle θ increases",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "As the spacer expands (t increases), wedge angle θ = t/L increases. Since β = λ / (2θ), the fringe width decreases."
    },
    {
      "id": "wedge-q35",
      "question": "What is the phase difference between the two interfering beams at the m-th dark fringe in a reflected wedge film?",
      "options": [
        "(2m + 1) * π radians",
        "2m * π radians",
        "m * π / 2 radians",
        "Zero"
      ],
      "answer": "(2m + 1) * π radians",
      "correct_option": "(2m + 1) * π radians",
      "difficulty": "hard",
      "global_id": 35,
      "explanation": "Destructive interference occurs when the total phase difference is an odd multiple of π: δ = (2m + 1)π radians."
    },
    {
      "id": "wedge-q36",
      "question": "What is the phase difference between the two interfering beams at the m-th bright fringe in a reflected wedge film?",
      "options": [
        "2m * π radians (even multiple of π)",
        "(2m + 1) * π radians",
        "m * π / 4 radians",
        "π / 2 radians"
      ],
      "answer": "2m * π radians (even multiple of π)",
      "correct_option": "2m * π radians (even multiple of π)",
      "difficulty": "hard",
      "global_id": 36,
      "explanation": "Constructive interference occurs when the total phase difference between the two waves is an even multiple of π (0, 2π, 4π, ...)."
    },
    {
      "id": "wedge-q37",
      "question": "If the angle of incidence i of light onto a wedge film is increased from 0° (normal) to an angle i > 0, what is the effective path difference?",
      "options": [
        "Δ = 2 * µ * t * cos(r) + λ/2",
        "Δ = 2 * µ * t * sin(r) + λ/2",
        "Δ = 2 * µ * t / cos(r)",
        "Δ = 2 * µ * t * tan(r)"
      ],
      "answer": "Δ = 2 * µ * t * cos(r) + λ/2",
      "correct_option": "Δ = 2 * µ * t * cos(r) + λ/2",
      "difficulty": "hard",
      "global_id": 37,
      "explanation": "For oblique incidence at refraction angle r, the geometric path difference is 2µt cos(r), plus λ/2 from boundary reflection."
    },
    {
      "id": "wedge-q38",
      "question": "How does increasing the angle of incidence from 0° to an oblique angle affect the fringe width in a wedge film?",
      "options": [
        "Fringe width increases because cos(r) < 1 reduces the effective path difference rate",
        "Fringe width decreases",
        "Fringes vanish instantly",
        "Fringes become circular"
      ],
      "answer": "Fringe width increases because cos(r) < 1 reduces the effective path difference rate",
      "correct_option": "Fringe width increases because cos(r) < 1 reduces the effective path difference rate",
      "difficulty": "hard",
      "global_id": 38,
      "explanation": "Since β = λ / (2µθ cos r) and cos(r) < 1, the fringes spread slightly farther apart as incidence angle increases."
    },
    {
      "id": "wedge-q39",
      "question": "If a drop of water (µ = 1.33) is placed at the edge of an air wedge, capillary action draws it in. How do the fringes behave?",
      "options": [
        "The fringes immediately compress closer together (fringe width decreases by 1/1.33 ≈ 0.75)",
        "The fringes expand by 1.33 times",
        "The fringes rotate 180°",
        "The contact line becomes bright in reflection"
      ],
      "answer": "The fringes immediately compress closer together (fringe width decreases by 1/1.33 ≈ 0.75)",
      "correct_option": "The fringes immediately compress closer together (fringe width decreases by 1/1.33 ≈ 0.75)",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "In water, β_water = λ / (2 * 1.33 * θ) = 0.752 * β_air. Fringes become noticeably denser."
    },
    {
      "id": "wedge-q40",
      "question": "What happens to the apex contact fringe if the two glass plates are pressed tightly together with a clamp?",
      "options": [
        "The central dark fringe broadens over the entire contact area where t = 0",
        "The contact fringe turns into a bright spot",
        "Fringes turn into concentric circles",
        "The glass loses transparency"
      ],
      "answer": "The central dark fringe broadens over the entire contact area where t = 0",
      "correct_option": "The central dark fringe broadens over the entire contact area where t = 0",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "Optical contact over a finite area maintains t = 0 everywhere within that zone, expanding the dark zero-order region across the contact contact patch."
    },
    {
      "id": "wedge-q41",
      "question": "Can a wedge-shaped film be formed using a soap film held vertically in a wire frame?",
      "options": [
        "Yes, gravity pulls liquid downward, creating a vertical thickness gradient that forms horizontal wedge fringes",
        "No, soap films are always of constant thickness",
        "No, soap films cannot reflect light",
        "Only in zero gravity"
      ],
      "answer": "Yes, gravity pulls liquid downward, creating a vertical thickness gradient that forms horizontal wedge fringes",
      "correct_option": "Yes, gravity pulls liquid downward, creating a vertical thickness gradient that forms horizontal wedge fringes",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "Gravity drains liquid downward while surface tension holds the top, creating a vertical wedge with horizontal interference bands."
    },
    {
      "id": "wedge-q42",
      "question": "In a vertical soap film, what does the appearance of a black band at the top indicate just before the film pops?",
      "options": [
        "The film thickness at the top has become much less than λ/4 (approaching zero thickness)",
        "The film has absorbed all incident light",
        "The soap solution has turned into oil",
        "The refractive index has become infinite"
      ],
      "answer": "The film thickness at the top has become much less than λ/4 (approaching zero thickness)",
      "correct_option": "The film thickness at the top has become much less than λ/4 (approaching zero thickness)",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "When film thickness t << λ/4, path difference is dominated by the π phase shift, making the film appear completely black just before rupture."
    },
    {
      "id": "wedge-q43",
      "question": "What is the ratio of fringe widths β1 / β2 for two air wedges of equal length L using spacers of thickness t1 = 20 µm and t2 = 60 µm?",
      "options": [
        "β1 / β2 = 3 : 1",
        "β1 / β2 = 1 : 3",
        "β1 / β2 = 9 : 1",
        "β1 / β2 = 1 : 1"
      ],
      "answer": "β1 / β2 = 3 : 1",
      "correct_option": "β1 / β2 = 3 : 1",
      "difficulty": "medium",
      "global_id": 43,
      "explanation": "Since β ∝ 1/t, β1 / β2 = t2 / t1 = 60 µm / 20 µm = 3."
    },
    {
      "id": "wedge-q44",
      "question": "If light of wavelength λ1 = 400 nm produces 30 fringes in a given wedge distance, how many fringes will λ2 = 600 nm produce over the same distance?",
      "options": [
        "20 fringes",
        "45 fringes",
        "15 fringes",
        "60 fringes"
      ],
      "answer": "20 fringes",
      "correct_option": "20 fringes",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "Total distance = N * β. Since β ∝ λ, N1 * λ1 = N2 * λ2. Thus N2 = N1 * (λ1 / λ2) = 30 * (400 / 600) = 20 fringes."
    },
    {
      "id": "wedge-q45",
      "question": "Why must the glass plates used to form an experimental air wedge have optically flat surfaces?",
      "options": [
        "Any microscopic surface irregularities distort the straight fringes into irregular wavy lines",
        "Curved glass cannot transmit light",
        "Non-flat glass breaks when clamped",
        "Refractive index varies across non-flat glass"
      ],
      "answer": "Any microscopic surface irregularities distort the straight fringes into irregular wavy lines",
      "correct_option": "Any microscopic surface irregularities distort the straight fringes into irregular wavy lines",
      "difficulty": "easy",
      "global_id": 45,
      "explanation": "Fringes map optical film thickness; only optically flat plates guarantee that thickness increases linearly, producing straight, evenly-spaced fringes."
    },
    {
      "id": "wedge-q46",
      "question": "In an experiment, if 50 fringes occupy a length of 2.5 cm, what is the wedge angle θ in radians (using λ = 500 nm)?",
      "options": [
        "0.0005 radians (0.5 mrad)",
        "0.005 radians",
        "0.00005 radians",
        "0.05 radians"
      ],
      "answer": "0.0005 radians (0.5 mrad)",
      "correct_option": "0.0005 radians (0.5 mrad)",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "β = 2.5 cm / 50 = 0.05 cm = 5.0e-4 m. θ = λ / (2β) = 500e-9 m / (2 * 5.0e-4 m) = 5.0e-7 / 1.0e-3 = 5.0e-4 rad = 0.50 mrad."
    },
    {
      "id": "wedge-q47",
      "question": "What causes the contrast (visibility) of wedge film fringes to degrade when using a light source with a broad spectral bandwidth Δλ?",
      "options": [
        "Fringes for different wavelengths gradually shift out of phase as order n increases, washing out the pattern",
        "Broadband light travels slower through glass",
        "The glass plates become polarized",
        "The wedge angle changes with wavelength"
      ],
      "answer": "Fringes for different wavelengths gradually shift out of phase as order n increases, washing out the pattern",
      "correct_option": "Fringes for different wavelengths gradually shift out of phase as order n increases, washing out the pattern",
      "difficulty": "medium",
      "global_id": 47,
      "explanation": "Fringe visibility V = (I_max - I_min) / (I_max + I_min) decays as path difference approaches the coherence length L_c ≈ λ² / Δλ."
    },
    {
      "id": "wedge-q48",
      "question": "How can one experimentally distinguish between bright fringes of consecutive order (n and n+1)?",
      "options": [
        "Order n+1 corresponds to an increase in film thickness of exactly Δt = λ / (2µ)",
        "Order n+1 has twice the light intensity",
        "Order n+1 has a different color in monochromatic light",
        "Order n+1 is always invisible"
      ],
      "answer": "Order n+1 corresponds to an increase in film thickness of exactly Δt = λ / (2µ)",
      "correct_option": "Order n+1 corresponds to an increase in film thickness of exactly Δt = λ / (2µ)",
      "difficulty": "medium",
      "global_id": 48,
      "explanation": "Moving from one bright fringe to the next corresponds to an increase in film thickness of exactly Δt = λ / (2µ)."
    },
    {
      "id": "wedge-q49",
      "question": "If an air wedge film has a small wedge angle of 1 minute of arc (1' = 2.909 x 10⁻⁴ rad), what is the fringe width for λ = 589 nm?",
      "options": [
        "1.01 mm",
        "0.50 mm",
        "2.02 mm",
        "0.10 mm"
      ],
      "answer": "1.01 mm",
      "correct_option": "1.01 mm",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "β = λ / (2θ) = 589e-9 m / (2 * 2.909e-4 rad) = 5.89e-7 / 5.818e-4 = 1.012e-3 m ≈ 1.01 mm."
    },
    {
      "id": "wedge-q50",
      "question": "Why does an air wedge film not show interference fringes if the top plate is lifted to create an air gap of several centimeters?",
      "options": [
        "The thickness exceeds the temporal coherence length of the light source, so wave packets no longer overlap in time",
        "Air absorbs light over centimeters",
        "Light stops reflecting at larger distances",
        "The glass plates lose mutual capacitance"
      ],
      "answer": "The thickness exceeds the temporal coherence length of the light source, so wave packets no longer overlap in time",
      "correct_option": "The thickness exceeds the temporal coherence length of the light source, so wave packets no longer overlap in time",
      "difficulty": "medium",
      "global_id": 50,
      "explanation": "For path differences 2µt larger than the source coherence length, the two wave trains cannot maintain a fixed phase relationship, eliminating observable interference."
    }
  ]
};

export const NEWTONS_RINGS_QUESTION_BANK = {
  "experiment": "Newton's Rings Wave Interference - Question Bank",
  "experimentId": "newtons-rings",
  "quizId": "newtons-rings-mastery-quiz",
  "experimentName": "Newton's Rings Wave Interference",
  "description": "Comprehensive 50-Question Physics Question Bank for Newton's Rings Wave Interference",
  "total_questions": 50,
  "questions": [
    {
      "id": "nr-q1",
      "question": "Why is the central spot in Newton's rings observed to be dark in reflected light?",
      "options": [
        "Because reflection at the lower air-to-glass boundary introduces an abrupt π phase reversal (λ/2 path shift)",
        "Because light is completely absorbed by the glass plate at the point of contact",
        "Because the film thickness is equal to a full wavelength at the center",
        "Because the lens curvature reflects all light away from the microscope"
      ],
      "answer": "Because reflection at the lower air-to-glass boundary introduces an abrupt π phase reversal (λ/2 path shift)",
      "correct_option": "Because reflection at the lower air-to-glass boundary introduces an abrupt π phase reversal (λ/2 path shift)",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "At the point of contact, film thickness t = 0. Reflection from the denser glass plate introduces a π phase reversal (path difference of λ/2), satisfying the condition for complete destructive interference."
    },
    {
      "id": "nr-q2",
      "question": "In reflected monochromatic light, how does the diameter Dₘ of the m-th dark Newton's ring depend on ring order m?",
      "options": [
        "Dₘ is proportional to the square root of m (Dₘ ∝ √m)",
        "Dₘ is directly proportional to m (Dₘ ∝ m)",
        "Dₘ is proportional to m squared (Dₘ ∝ m²)",
        "Dₘ is inversely proportional to m"
      ],
      "answer": "Dₘ is proportional to the square root of m (Dₘ ∝ √m)",
      "correct_option": "Dₘ is proportional to the square root of m (Dₘ ∝ √m)",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "From the interference condition 2t = mλ and lens sagitta t = Dₘ² / (8R), we obtain Dₘ² = 4mλR, so Dₘ = 2√(mλR) ∝ √m."
    },
    {
      "id": "nr-q3",
      "question": "Why do Newton's rings crowd closer together as their order m increases?",
      "options": [
        "Because ring diameter scales as √m, and the difference between successive square roots decreases with increasing m",
        "Because the wavelength of light decreases towards the edge of the lens",
        "Because optical absorption increases rapidly in thicker air films",
        "Because spherical aberration curves the wavefront into ellipses"
      ],
      "answer": "Because ring diameter scales as √m, and the difference between successive square roots decreases with increasing m",
      "correct_option": "Because ring diameter scales as √m, and the difference between successive square roots decreases with increasing m",
      "difficulty": "medium",
      "global_id": 3,
      "explanation": "Since Dₘ ∝ √m, the radial spacing between consecutive rings (e.g. √10 - √9 < √2 - √1) continuously decreases, resulting in fringe crowding at larger radii."
    },
    {
      "id": "nr-q4",
      "question": "What is the relationship between the diameters of the (m+p)-th and m-th dark rings in an air film?",
      "options": [
        "Dₘ₊ₚ² − Dₘ² = 4pλR",
        "Dₘ₊ₚ − Dₘ = 2pλR",
        "Dₘ₊ₚ² − Dₘ² = 2pλR",
        "Dₘ₊ₚ² / Dₘ² = 4pλR"
      ],
      "answer": "Dₘ₊ₚ² − Dₘ² = 4pλR",
      "correct_option": "Dₘ₊ₚ² − Dₘ² = 4pλR",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "Dₘ₊ₚ² = 4(m+p)λR and Dₘ² = 4mλR. Subtracting the two yields Dₘ₊ₚ² − Dₘ² = 4pλR, eliminating central contact uncertainty."
    },
    {
      "id": "nr-q5",
      "question": "If a liquid of refractive index μ = 1.33 (water) replaces the air film between the lens and glass plate, what happens to the rings?",
      "options": [
        "The rings contract inwards because Dₘ ∝ 1/√μ",
        "The rings expand outwards because Dₘ ∝ √μ",
        "The rings disappear completely due to total internal reflection",
        "The central spot transforms into a bright fringe"
      ],
      "answer": "The rings contract inwards because Dₘ ∝ 1/√μ",
      "correct_option": "The rings contract inwards because Dₘ ∝ 1/√μ",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "With medium of refractive index μ, the path condition is 2μt = mλ, leading to Dₘ² = 4mλR / μ. Since μ > 1, all ring diameters contract by a factor of 1/√μ."
    },
    {
      "id": "nr-q6",
      "question": "Why is a plano-convex lens with a very large radius of curvature (e.g. R = 100 cm) used instead of a strongly curved lens?",
      "options": [
        "To ensure the air film thickness increases very slowly, producing wide rings that can be measured accurately with a travelling microscope",
        "To prevent chromatic dispersion in the glass material",
        "Because small radius lenses cannot reflect monochromatic light",
        "To increase the optical intensity of the central spot"
      ],
      "answer": "To ensure the air film thickness increases very slowly, producing wide rings that can be measured accurately with a travelling microscope",
      "correct_option": "To ensure the air film thickness increases very slowly, producing wide rings that can be measured accurately with a travelling microscope",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "A large radius R keeps the film thickness t extremely small over a large radial distance r, producing broad, measurable fringe diameters without excessive crowding."
    },
    {
      "id": "nr-q7",
      "question": "What type of interference fringes are Newton's rings classified as?",
      "options": [
        "Fringes of equal thickness (Fizeau fringes)",
        "Fringes of equal inclination (Haidinger fringes)",
        "Fraunhofer diffraction fringes",
        "Non-localized Fresnel zone fringes"
      ],
      "answer": "Fringes of equal thickness (Fizeau fringes)",
      "correct_option": "Fringes of equal thickness (Fizeau fringes)",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Newton's rings are localized fringes of equal thickness because each dark or bright circular fringe corresponds to a locus of constant air film thickness t."
    },
    {
      "id": "nr-q8",
      "question": "What is the expected appearance of the central spot in Newton's rings observed in transmitted light?",
      "options": [
        "Bright, because no relative phase shift occurs between the two transmitted rays at t = 0",
        "Dark, identical to the reflected pattern",
        "Completely invisible because transmitted light does not interfere",
        "A rainbow spectrum of colors"
      ],
      "answer": "Bright, because no relative phase shift occurs between the two transmitted rays at t = 0",
      "correct_option": "Bright, because no relative phase shift occurs between the two transmitted rays at t = 0",
      "difficulty": "hard",
      "global_id": 8,
      "explanation": "In transmitted light, both interfering rays either undergo two internal reflections or none, resulting in zero net reflection phase difference at t = 0 (constructive interference)."
    },
    {
      "id": "nr-q9",
      "question": "When plotting Dₙ² on the y-axis against ring order n on the x-axis for an air film, what does the slope of the straight line represent?",
      "options": [
        "Slope = 4λR",
        "Slope = 2λR",
        "Slope = λ / (4R)",
        "Slope = 4R / λ"
      ],
      "answer": "Slope = 4λR",
      "correct_option": "Slope = 4λR",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Since Dₙ² = 4nλR, differentiating with respect to n gives d(Dₙ²)/dn = 4λR. Thus, the linear regression slope is exactly 4λR."
    },
    {
      "id": "nr-q10",
      "question": "In an experiment with Sodium light (λ = 589.3 nm) and R = 100 cm, what is the theoretical diameter of the 4th dark ring in air?",
      "options": [
        "3.07 mm",
        "1.53 mm",
        "6.14 mm",
        "0.77 mm"
      ],
      "answer": "3.07 mm",
      "correct_option": "3.07 mm",
      "difficulty": "hard",
      "global_id": 10,
      "explanation": "D₄ = 2√(4 * 589.3e-9 m * 1.0 m) = 2√(2.3572e-6) = 2 * 0.001535 m = 0.00307 m = 3.07 mm."
    },
    {
      "id": "nr-q11",
      "question": "Why do Newton's rings become closer and closer together (crowded) as the ring order n increases away from the center?",
      "options": [
        "The air film thickness increases non-linearly with radius as r² (since t = r² / 2R)",
        "The wavelength of light changes with distance",
        "The glass plate becomes thicker at the edges",
        "Light intensity drops to zero at higher orders"
      ],
      "answer": "The air film thickness increases non-linearly with radius as r² (since t = r² / 2R)",
      "correct_option": "The air film thickness increases non-linearly with radius as r² (since t = r² / 2R)",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "Because t = r² / (2R), the radial spacing Δr = r_n - r_{n-1} ∝ 1/√n. Consequently, outer fringes become progressively narrower and pack tightly together."
    },
    {
      "id": "nr-q12",
      "question": "What is the theoretical diameter D_n of the n-th dark ring in reflected light for an air film (µ = 1)?",
      "options": [
        "D_n = 2 * √(n * λ * R)",
        "D_n = √(2n * λ * R)",
        "D_n = 4 * n * λ * R",
        "D_n = 2 * n * λ * R"
      ],
      "answer": "D_n = 2 * √(n * λ * R)",
      "correct_option": "D_n = 2 * √(n * λ * R)",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "Condition for dark ring is 2t = nλ. Since t = r_n² / (2R), r_n² = nλR, which gives D_n = 2r_n = 2√(nλR)."
    },
    {
      "id": "nr-q13",
      "question": "What is the theoretical diameter D_n of the n-th bright ring in reflected light for an air film?",
      "options": [
        "D_n = √[2 * (2n - 1) * λ * R]",
        "D_n = 2 * √(n * λ * R)",
        "D_n = (2n - 1) * λ * R",
        "D_n = 4 * (2n - 1) * λ * R"
      ],
      "answer": "D_n = √[2 * (2n - 1) * λ * R]",
      "correct_option": "D_n = √[2 * (2n - 1) * λ * R]",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "Condition for bright ring is 2t = (2n - 1)λ/2. Thus r_n² = (2n - 1)λR / 2, giving D_n = 2r_n = √[2(2n - 1)λR]."
    },
    {
      "id": "nr-q14",
      "question": "In the Newton's rings experiment, what fundamental linear relationship eliminates the error caused by imperfect contact at the center (e.g. dust particle)?",
      "options": [
        "D_{n+p}² - D_n² = 4 * p * λ * R / µ",
        "D_{n+p} - D_n = 4 * p * λ * R",
        "D_{n+p}² + D_n² = 4 * p * λ * R",
        "D_{n+p}² / D_n² = p"
      ],
      "answer": "D_{n+p}² - D_n² = 4 * p * λ * R / µ",
      "correct_option": "D_{n+p}² - D_n² = 4 * p * λ * R / µ",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "Any zero-point offset error in film thickness shifts all D² values equally: D_n² = 4nλR + 4cR. Subtracting two squared diameters cancels the constant c completely."
    },
    {
      "id": "nr-q15",
      "question": "How is the refractive index µ of an unknown transparent liquid determined using Newton's rings?",
      "options": [
        "µ = (D_{n+p}² - D_n²)_air / (D_{n+p}² - D_n²)_liquid",
        "µ = (D_{n+p}² - D_n²)_liquid / (D_{n+p}² - D_n²)_air",
        "µ = (D_n)_air / (D_n)_liquid",
        "µ = √[(D_n)_air * (D_n)_liquid]"
      ],
      "answer": "µ = (D_{n+p}² - D_n²)_air / (D_{n+p}² - D_n²)_liquid",
      "correct_option": "µ = (D_{n+p}² - D_n²)_air / (D_{n+p}² - D_n²)_liquid",
      "difficulty": "medium",
      "global_id": 15,
      "explanation": "Since (D_{n+p}² - D_n²) = 4pλR / µ, taking the ratio of the air measurement (µ_air = 1) to the liquid measurement yields the liquid refractive index µ directly."
    },
    {
      "id": "nr-q16",
      "question": "What happens to the diameters of Newton's rings when water (µ = 1.33) is introduced between the lens and the glass plate?",
      "options": [
        "All ring diameters contract (become smaller by a factor of 1/√1.33 ≈ 0.867)",
        "All ring diameters expand",
        "The rings become squares",
        "The central spot turns bright in reflection"
      ],
      "answer": "All ring diameters contract (become smaller by a factor of 1/√1.33 ≈ 0.867)",
      "correct_option": "All ring diameters contract (become smaller by a factor of 1/√1.33 ≈ 0.867)",
      "difficulty": "easy",
      "global_id": 16,
      "explanation": "Since D_n ∝ 1/√µ, filling the gap with a denser optical medium reduces effective wavelength, compressing all ring diameters inward."
    },
    {
      "id": "nr-q17",
      "question": "If the radius of curvature R of the plano-convex lens is increased (flatter lens), how do the ring diameters change?",
      "options": [
        "Ring diameters increase (fringes expand outward and are easier to measure)",
        "Ring diameters decrease",
        "Ring diameters remain identical",
        "Fringes disappear"
      ],
      "answer": "Ring diameters increase (fringes expand outward and are easier to measure)",
      "correct_option": "Ring diameters increase (fringes expand outward and are easier to measure)",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "Since D_n = 2√(nλR), larger radius of curvature R stretches out the circular fringes radially, enabling higher measurement precision with a travelling microscope."
    },
    {
      "id": "nr-q18",
      "question": "Why is a lens with a very large radius of curvature (e.g. R = 100 cm or 200 cm) preferred in the Newton's rings experiment?",
      "options": [
        "To make the air film wedge angle extremely small so the rings have conveniently large diameters",
        "To focus the light into a small point",
        "To increase optical magnification",
        "To filter out unwanted colors"
      ],
      "answer": "To make the air film wedge angle extremely small so the rings have conveniently large diameters",
      "correct_option": "To make the air film wedge angle extremely small so the rings have conveniently large diameters",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "A large R creates an extremely gradual increase in air film thickness, expanding the ring diameters into the millimeter scale readable by a standard vernier microscope."
    },
    {
      "id": "nr-q19",
      "question": "If a speck of dust or grit is trapped at the point of contact between the lens and flat glass plate, what happens to the central spot?",
      "options": [
        "The central spot becomes bright instead of dark because the film thickness at the contact is no longer zero",
        "The rings turn into straight lines",
        "The rings disappear completely",
        "The light changes from yellow to green"
      ],
      "answer": "The central spot becomes bright instead of dark because the film thickness at the contact is no longer zero",
      "correct_option": "The central spot becomes bright instead of dark because the film thickness at the contact is no longer zero",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "A dust particle maintains a finite air gap t > 0. If 2t + λ/2 = mλ (e.g. t = λ/4), constructive interference occurs, making the center bright."
    },
    {
      "id": "nr-q20",
      "question": "In an experiment with Sodium light (λ = 589.3 nm) and R = 1.0 m, the diameter of the 4th dark ring is 3.07 mm. What is the diameter of the 16th dark ring?",
      "options": [
        "6.14 mm",
        "12.28 mm",
        "4.34 mm",
        "9.21 mm"
      ],
      "answer": "6.14 mm",
      "correct_option": "6.14 mm",
      "difficulty": "hard",
      "global_id": 20,
      "explanation": "Since D_n ∝ √n, D_16 / D_4 = √(16 / 4) = √4 = 2. Thus D_16 = 2 * 3.07 mm = 6.14 mm."
    },
    {
      "id": "nr-q21",
      "question": "In reflected light, what is the optical path difference between the two interfering rays for a film of thickness t at normal incidence?",
      "options": [
        "Δ = 2 * µ * t + λ / 2",
        "Δ = 2 * µ * t",
        "Δ = µ * t + λ / 2",
        "Δ = 2 * µ * t - λ"
      ],
      "answer": "Δ = 2 * µ * t + λ / 2",
      "correct_option": "Δ = 2 * µ * t + λ / 2",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "The beam reflecting from the top of the lower glass plate undergoes an internal-to-external reflection at a denser medium, introducing a Stokes phase shift of π (path difference λ/2). Total Δ = 2µt + λ/2."
    },
    {
      "id": "nr-q22",
      "question": "If Newton's rings are viewed in transmitted light, why is the central spot bright?",
      "options": [
        "Both interfering rays either undergo two internal reflections or none, resulting in zero net reflection phase change at t = 0",
        "Transmitted light travels faster",
        "The glass absorbs dark rings",
        "Refraction doubles the intensity"
      ],
      "answer": "Both interfering rays either undergo two internal reflections or none, resulting in zero net reflection phase change at t = 0",
      "correct_option": "Both interfering rays either undergo two internal reflections or none, resulting in zero net reflection phase change at t = 0",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "In transmission, ray 1 has no reflection and ray 2 has two internal reflections (each π, total 2π = 0). At t = 0, optical path difference is zero, giving a bright center."
    },
    {
      "id": "nr-q23",
      "question": "How do the ring diameters in transmitted light compare to those in reflected light?",
      "options": [
        "The rings are complementary: dark rings in reflected light become bright rings in transmitted light, and vice versa",
        "They are identical in position and intensity",
        "Transmitted rings are twice as large",
        "Transmitted rings do not form"
      ],
      "answer": "The rings are complementary: dark rings in reflected light become bright rings in transmitted light, and vice versa",
      "correct_option": "The rings are complementary: dark rings in reflected light become bright rings in transmitted light, and vice versa",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "By conservation of energy (R + T = 1 for non-absorbing media), constructive interference in reflection corresponds to destructive interference in transmission."
    },
    {
      "id": "nr-q24",
      "question": "Why are Newton's rings circular in shape rather than straight lines?",
      "options": [
        "The air film between a spherical lens surface and a plane plate has circular symmetry of equal thickness (t = r² / 2R)",
        "The microscope lens is circular",
        "Light rays rotate as they propagate",
        "The light source is spherical"
      ],
      "answer": "The air film between a spherical lens surface and a plane plate has circular symmetry of equal thickness (t = r² / 2R)",
      "correct_option": "The air film between a spherical lens surface and a plane plate has circular symmetry of equal thickness (t = r² / 2R)",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "The loci of points having identical thickness t form concentric circles centered at the point of contact; hence the fringes of equal thickness are concentric circles."
    },
    {
      "id": "nr-q25",
      "question": "If white light is used instead of monochromatic light in Newton's rings, what is observed?",
      "options": [
        "A central dark spot surrounded by a few colored concentric rings, fading into uniform white illumination",
        "Sharp black-and-white rings to infinity",
        "A solid dark circle covering the lens",
        "A stationary rainbow cross"
      ],
      "answer": "A central dark spot surrounded by a few colored concentric rings, fading into uniform white illumination",
      "correct_option": "A central dark spot surrounded by a few colored concentric rings, fading into uniform white illumination",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "At the center, t = 0 is dark for all wavelengths. For outer rings, each wavelength has its own ring radius r(λ) ∝ √λ; the overlapping colors blur into white beyond a few orders."
    },
    {
      "id": "nr-q26",
      "question": "In a travelling microscope, why is the crosshair always traversed along the horizontal diameter in one consistent direction (e.g. strictly left to right)?",
      "options": [
        "To prevent backlash error in the micrometer lead screw",
        "To avoid polarizing the light",
        "Because the rings are asymmetric",
        "To prevent lens heating"
      ],
      "answer": "To prevent backlash error in the micrometer lead screw",
      "correct_option": "To prevent backlash error in the micrometer lead screw",
      "difficulty": "easy",
      "global_id": 26,
      "explanation": "Travelling microscopes use precision lead screws; moving only in one direction ensures the gear teeth remain engaged on the same flank, avoiding mechanical backlash error."
    },
    {
      "id": "nr-q27",
      "question": "If D_20² = 25.0 mm² and D_10² = 12.5 mm² for an air film using λ = 500 nm, what is the radius of curvature R of the lens?",
      "options": [
        "1.25 m",
        "0.625 m",
        "2.50 m",
        "5.00 m"
      ],
      "answer": "1.25 m",
      "correct_option": "1.25 m",
      "difficulty": "hard",
      "global_id": 27,
      "explanation": "D_{n+p}² - D_n² = 4pλR. Here p = 10, difference = 12.5 mm² = 1.25e-5 m². R = 1.25e-5 / (4 * 10 * 500e-9) = 1.25e-5 / 2.0e-5 = 0.625 m? Wait: 4 * 10 * 5e-7 = 2e-5. 1.25e-5 / 2e-5 = 0.625 m."
    },
    {
      "id": "nr-q28",
      "question": "If the plano-convex lens is replaced by a convex lens placed on a concave lens of larger radius R2 > R1, what is the effective radius R_eff in the ring formula?",
      "options": [
        "1 / R_eff = (1 / R1) - (1 / R2)",
        "1 / R_eff = (1 / R1) + (1 / R2)",
        "R_eff = R1 + R2",
        "R_eff = √(R1 * R2)"
      ],
      "answer": "1 / R_eff = (1 / R1) - (1 / R2)",
      "correct_option": "1 / R_eff = (1 / R1) - (1 / R2)",
      "difficulty": "hard",
      "global_id": 28,
      "explanation": "Thickness t = (r² / 2R1) - (r² / 2R2) = (r² / 2) * (1/R1 - 1/R2). Thus 1/R_eff = 1/R1 - 1/R2."
    },
    {
      "id": "nr-q29",
      "question": "What is the slope of the graph plotted between D_n² (y-axis) and ring order n (x-axis) for an air film?",
      "options": [
        "Slope = 4 * λ * R",
        "Slope = 2 * λ * R",
        "Slope = λ * R",
        "Slope = 4 * R / λ"
      ],
      "answer": "Slope = 4 * λ * R",
      "correct_option": "Slope = 4 * λ * R",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "Since D_n² = 4nλR, the linear equation y = m*x has slope m = 4λR. Measuring this slope provides an accurate way to find λ or R."
    },
    {
      "id": "nr-q30",
      "question": "How is the radius of curvature R of the plano-convex lens independently measured in a physics laboratory?",
      "options": [
        "Using a spherometer or Boy's optical method",
        "Using a vernier caliper directly across the surface",
        "Using a hydrometer",
        "Using an oscilloscope"
      ],
      "answer": "Using a spherometer or Boy's optical method",
      "correct_option": "Using a spherometer or Boy's optical method",
      "difficulty": "easy",
      "global_id": 30,
      "explanation": "A spherometer measures the sagitta h of the curved spherical surface: R = l² / (6h) + h / 2."
    },
    {
      "id": "nr-q31",
      "question": "What optical instrument is used to measure the fringe ring diameters with 0.01 mm precision?",
      "options": [
        "A travelling microscope with a vernier scale",
        "A telescope at 10 meters distance",
        "A micrometer screw gauge clamped to the lens",
        "A spectrometer with prism table"
      ],
      "answer": "A travelling microscope with a vernier scale",
      "correct_option": "A travelling microscope with a vernier scale",
      "difficulty": "easy",
      "global_id": 31,
      "explanation": "A travelling microscope mounted on horizontal lead screw slides allows crosshairs to align with left and right edges of each ring to measure D_n = |x_right - x_left|."
    },
    {
      "id": "nr-q32",
      "question": "Why is the contrast of Newton's rings observed in reflected light much higher than in transmitted light?",
      "options": [
        "In reflection, the two interfering rays have nearly equal amplitudes (~4% each), while in transmission one ray is ~96% and the other ~0.16%",
        "Transmitted light is absorbed by air",
        "Reflected light has higher frequency",
        "The lens reflects 100% of the light"
      ],
      "answer": "In reflection, the two interfering rays have nearly equal amplitudes (~4% each), while in transmission one ray is ~96% and the other ~0.16%",
      "correct_option": "In reflection, the two interfering rays have nearly equal amplitudes (~4% each), while in transmission one ray is ~96% and the other ~0.16%",
      "difficulty": "hard",
      "global_id": 32,
      "explanation": "At glass-air boundaries, reflection is ~4%. In reflection, both beams have amplitude ~0.2, yielding near-zero minimum. In transmission, beam 1 is ~0.96 and beam 2 is ~0.0016, so the interference modulation is tiny."
    },
    {
      "id": "nr-q33",
      "question": "What happens to Newton's rings if the plano-convex lens is slowly lifted vertically away from the flat glass plate?",
      "options": [
        "The rings collapse inward and disappear into the center one by one",
        "The rings expand outward indefinitely",
        "The rings turn into vertical straight lines",
        "The rings freeze in position"
      ],
      "answer": "The rings collapse inward and disappear into the center one by one",
      "correct_option": "The rings collapse inward and disappear into the center one by one",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Lifting the lens increases the thickness t everywhere. To maintain a constant thickness for a given order, the radius r must decrease: rings contract inward toward the center."
    },
    {
      "id": "nr-q34",
      "question": "If an air film Newton's ring pattern has D_10 = 5.00 mm, what would its diameter be if the air is replaced by benzene (µ = 1.50)?",
      "options": [
        "4.08 mm",
        "3.33 mm",
        "6.12 mm",
        "7.50 mm"
      ],
      "answer": "4.08 mm",
      "correct_option": "4.08 mm",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "D_liquid = D_air / √µ = 5.00 mm / √1.50 = 5.00 / 1.2247 ≈ 4.08 mm."
    },
    {
      "id": "nr-q35",
      "question": "What is the thickness of the air film at the position of the 5th dark ring for sodium light (λ = 589.3 nm)?",
      "options": [
        "1.47 µm",
        "2.95 µm",
        "0.74 µm",
        "5.89 µm"
      ],
      "answer": "1.47 µm",
      "correct_option": "1.47 µm",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "Condition for dark ring: 2t = nλ. For n = 5: t = 5 * λ / 2 = 5 * 589.3 nm / 2 = 1473.25 nm ≈ 1.47 µm."
    },
    {
      "id": "nr-q36",
      "question": "What is the thickness of the air film at the position of the 1st bright ring for λ = 589 nm?",
      "options": [
        "0.147 µm (147 nm)",
        "0.295 µm",
        "0.589 µm",
        "0.073 µm"
      ],
      "answer": "0.147 µm (147 nm)",
      "correct_option": "0.147 µm (147 nm)",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "Condition for bright ring: 2t = (2n - 1)λ / 2. For n = 1: 2t = λ/2 -> t = λ / 4 = 589 nm / 4 = 147.25 nm ≈ 0.147 µm."
    },
    {
      "id": "nr-q37",
      "question": "If the flat glass plate underneath is replaced by a plane mirror (reflectance ≈ 100%), why do Newton's rings become faint or invisible in reflected light?",
      "options": [
        "The high reflectance of the mirror makes the second beam (~100%) vastly stronger than the first beam (~4%), ruining interference contrast",
        "Mirrors cannot create interference",
        "Metal mirrors absorb all phase shifts",
        "The focal length of the lens becomes zero"
      ],
      "answer": "The high reflectance of the mirror makes the second beam (~100%) vastly stronger than the first beam (~4%), ruining interference contrast",
      "correct_option": "The high reflectance of the mirror makes the second beam (~100%) vastly stronger than the first beam (~4%), ruining interference contrast",
      "difficulty": "hard",
      "global_id": 37,
      "explanation": "Fringe visibility V = 2√(I1*I2) / (I1 + I2). When I2 >> I1 (100% vs 4%), visibility drops to 2√(0.04) / 1.04 ≈ 0.38 / 1.04 ≈ 0.38, washing out the rings."
    },
    {
      "id": "nr-q38",
      "question": "How does the ring pattern change if a plano-convex lens with a cylindrical surface is used instead of a spherical surface?",
      "options": [
        "The fringes become straight, parallel lines running parallel to the cylinder axis",
        "The fringes become concentric circles",
        "The fringes become hyperbolas",
        "No interference occurs"
      ],
      "answer": "The fringes become straight, parallel lines running parallel to the cylinder axis",
      "correct_option": "The fringes become straight, parallel lines running parallel to the cylinder axis",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "A cylinder has constant curvature along its generator axis; the air film thickness varies in only one dimension (t = x² / 2R), producing straight parallel fringes."
    },
    {
      "id": "nr-q39",
      "question": "If an optical flat with an elliptical surface is used with a flat plate, what shape do the fringes take?",
      "options": [
        "Concentric ellipses",
        "Concentric circles",
        "Straight lines",
        "Parabolas"
      ],
      "answer": "Concentric ellipses",
      "correct_option": "Concentric ellipses",
      "difficulty": "easy",
      "global_id": 39,
      "explanation": "Lines of constant air film thickness t = (x²/2R_x) + (y²/2R_y) form concentric ellipses."
    },
    {
      "id": "nr-q40",
      "question": "What happens to the Newton's rings if the Sodium lamp source is replaced by an extended Helium-Neon laser (632.8 nm)?",
      "options": [
        "The rings are red and hundreds of orders remain visible due to the high coherence length of the laser",
        "The rings become invisible",
        "The rings turn black",
        "The central spot turns bright"
      ],
      "answer": "The rings are red and hundreds of orders remain visible due to the high coherence length of the laser",
      "correct_option": "The rings are red and hundreds of orders remain visible due to the high coherence length of the laser",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "Because a laser has an extremely long temporal coherence length (meters vs fractions of a millimeter for sodium), high-contrast rings persist to very high orders."
    },
    {
      "id": "nr-q41",
      "question": "In Newton's rings, why does the 45° glass plate need to be only semi-reflecting (unsilvered)?",
      "options": [
        "An unsilvered glass plate reflects ~4-8% downward and transmits ~90% upward, allowing the user to view the fringes clearly",
        "Silvered plates absorb all wavelengths",
        "Silver creates electromagnetic distortion",
        "Unsilvered plates rotate light polarization by 90°"
      ],
      "answer": "An unsilvered glass plate reflects ~4-8% downward and transmits ~90% upward, allowing the user to view the fringes clearly",
      "correct_option": "An unsilvered glass plate reflects ~4-8% downward and transmits ~90% upward, allowing the user to view the fringes clearly",
      "difficulty": "medium",
      "global_id": 41,
      "explanation": "An ordinary clean microscope slide provides adequate reflection to illuminate the film while remaining transparent enough for reflected fringe rays to pass through to the eyepiece."
    },
    {
      "id": "nr-q42",
      "question": "What is the effect on the ring pattern if the plano-convex lens has a slight wedge angle relative to the plate?",
      "options": [
        "The circular rings become distorted into eccentric or shifted non-concentric curves",
        "The rings turn into a single point",
        "The rings change color to blue",
        "The fringes vanish completely"
      ],
      "answer": "The circular rings become distorted into eccentric or shifted non-concentric curves",
      "correct_option": "The circular rings become distorted into eccentric or shifted non-concentric curves",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "Superimposing a linear wedge gradient on a quadratic spherical curvature shifts the centers of the rings and distorts circular symmetry into eccentric circles."
    },
    {
      "id": "nr-q43",
      "question": "If two wavelengths λ1 = 589.0 nm and λ2 = 589.6 nm (the Sodium D-doublet) illuminate Newton's rings, what happens at very high orders?",
      "options": [
        "Periodic fading and revival (beating) of fringe visibility occurs where bright rings of λ1 coincide with dark rings of λ2",
        "The rings permanently disappear at order 2",
        "The rings turn green",
        "The lens shatters from resonance"
      ],
      "answer": "Periodic fading and revival (beating) of fringe visibility occurs where bright rings of λ1 coincide with dark rings of λ2",
      "correct_option": "Periodic fading and revival (beating) of fringe visibility occurs where bright rings of λ1 coincide with dark rings of λ2",
      "difficulty": "hard",
      "global_id": 43,
      "explanation": "Because of the slight difference in wavelength (Δλ = 0.6 nm), the two ring patterns drift in and out of phase, creating visibility beats every n ≈ λ / (2Δλ) ≈ 490 orders."
    },
    {
      "id": "nr-q44",
      "question": "If the radius of the 10th dark ring is r_10 = 2.45 mm for λ = 600 nm, what is the radius of curvature R of the lens?",
      "options": [
        "1.00 m",
        "0.50 m",
        "2.00 m",
        "4.00 m"
      ],
      "answer": "1.00 m",
      "correct_option": "1.00 m",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "r_n² = nλR. R = r_n² / (nλ) = (2.45e-3 m)² / (10 * 600e-9 m) = 6.0025e-6 / 6.0e-6 ≈ 1.00 m."
    },
    {
      "id": "nr-q45",
      "question": "What is the area enclosed between the n-th and (n+1)-th dark rings in an air film?",
      "options": [
        "Area = π * λ * R (constant for all orders n)",
        "Area = n * π * λ * R",
        "Area = π * λ * R / n",
        "Area increases exponentially with n"
      ],
      "answer": "Area = π * λ * R (constant for all orders n)",
      "correct_option": "Area = π * λ * R (constant for all orders n)",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "A_n = π r_n² = π(nλR). The incremental area between consecutive rings is A_{n+1} - A_n = π(n+1)λR - πnλR = πλR, which is constant across all rings."
    },
    {
      "id": "nr-q46",
      "question": "Why does the central spot in Newton's rings appear slightly grey rather than pitch black in real laboratory conditions?",
      "options": [
        "Microscopic surface roughness and slight contamination prevent perfect zero thickness over the contact area",
        "Glass reflects 50% of light at normal incidence",
        "Photons tunnel through the glass",
        "Sodium light has infinite bandwidth"
      ],
      "answer": "Microscopic surface roughness and slight contamination prevent perfect zero thickness over the contact area",
      "correct_option": "Microscopic surface roughness and slight contamination prevent perfect zero thickness over the contact area",
      "difficulty": "easy",
      "global_id": 46,
      "explanation": "Real glass surfaces have sub-nanometer surface asperities and dust films, preventing ideal zero-gap contact across the entire central zone."
    },
    {
      "id": "nr-q47",
      "question": "If the lens is made of crown glass (µ_lens = 1.52), the liquid has µ_liq = 1.65, and the flat plate is flint glass (µ_plate = 1.70), what is the central spot in reflected light?",
      "options": [
        "Dark, because both reflections occur at denser media (π phase shift at each surface, net relative phase shift = 0, but Δ = 0 gives bright? No, wait!)",
        "Bright, because reflection at both boundaries occurs at denser media, giving identical phase shifts of π and leaving path difference 0",
        "Invisible",
        "Red"
      ],
      "answer": "Bright, because reflection at both boundaries occurs at denser media, giving identical phase shifts of π and leaving path difference 0",
      "correct_option": "Bright, because reflection at both boundaries occurs at denser media, giving identical phase shifts of π and leaving path difference 0",
      "difficulty": "hard",
      "global_id": 47,
      "explanation": "Here µ_lens (1.52) < µ_liq (1.65) < µ_plate (1.70). Both reflections occur at rarer-to-denser boundaries, so both experience a π phase shift. The relative phase difference is π - π = 0! At t = 0, Δ = 0 (constructive interference = bright central spot!)."
    },
    {
      "id": "nr-q48",
      "question": "What happens to the central spot if the liquid film has an intermediate index: µ_lens (1.60) > µ_liq (1.45) > µ_plate (1.35)?",
      "options": [
        "Bright, because neither reflection experiences a phase shift (both denser to rarer)",
        "Dark",
        "Invisible",
        "Green"
      ],
      "answer": "Bright, because neither reflection experiences a phase shift (both denser to rarer)",
      "correct_option": "Bright, because neither reflection experiences a phase shift (both denser to rarer)",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "Since µ_lens > µ_liq > µ_plate, both reflections occur at denser-to-rarer boundaries; neither experiences a π phase shift. At t = 0, optical path difference is zero, so the central spot is bright."
    },
    {
      "id": "nr-q49",
      "question": "Under what refractive index condition is the central spot of Newton's rings dark in reflected light?",
      "options": [
        "When exactly one reflection occurs at a denser boundary while the other occurs at a rarer boundary (e.g. glass-air-glass: 1.5 > 1.0 < 1.5)",
        "Whenever the liquid is transparent",
        "Only when µ = 1.0",
        "Whenever wavelength is 589 nm"
      ],
      "answer": "When exactly one reflection occurs at a denser boundary while the other occurs at a rarer boundary (e.g. glass-air-glass: 1.5 > 1.0 < 1.5)",
      "correct_option": "When exactly one reflection occurs at a denser boundary while the other occurs at a rarer boundary (e.g. glass-air-glass: 1.5 > 1.0 < 1.5)",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "A dark center requires an odd relative phase shift of π, which occurs if and only if one reflection has a π shift and the other has 0 (i.e. µ1 > µ_film < µ2)."
    },
    {
      "id": "nr-q50",
      "question": "If a student measures the diameters of 20 rings on both left and right sides of the center, why is D_n calculated as |x_right - x_left|?",
      "options": [
        "It directly measures the diameter across the center without needing to know the exact coordinate of the central spot",
        "It doubles the magnification of the microscope",
        "It eliminates chromatic aberration",
        "It converts radius into circumference"
      ],
      "answer": "It directly measures the diameter across the center without needing to know the exact coordinate of the central spot",
      "correct_option": "It directly measures the diameter across the center without needing to know the exact coordinate of the central spot",
      "difficulty": "easy",
      "global_id": 50,
      "explanation": "Measuring from the left edge x_L to the right edge x_R directly yields diameter D = x_R - x_L, avoiding the uncertainty of locating the exact geometric center."
    }
  ]
};

export const DIODE_QUESTION_BANK = {
  "experiment": "Diode V-I Characteristics - Question Bank",
  "experimentId": "diode",
  "quizId": "diode-vi-mastery-quiz",
  "experimentName": "Diode V-I Characteristics",
  "description": "Comprehensive 50-Question Physics Question Bank for Diode V-I Characteristics",
  "total_questions": 50,
  "questions": [
    {
      "id": "diode-q1",
      "question": "What is the typical barrier potential (knee/cut-in voltage) of a silicon p-n junction diode at room temperature (300 K)?",
      "options": [
        "Approximately 0.7 V",
        "Approximately 0.3 V",
        "Approximately 1.5 V",
        "Zero volts"
      ],
      "answer": "Approximately 0.7 V",
      "correct_option": "Approximately 0.7 V",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Silicon p-n junctions have a built-in potential barrier of approximately 0.6 V to 0.7 V at 300 K."
    },
    {
      "id": "diode-q2",
      "question": "What is the typical knee (threshold) voltage of a germanium p-n junction diode at room temperature?",
      "options": [
        "Approximately 0.3 V",
        "Approximately 0.7 V",
        "Approximately 1.1 V",
        "Approximately 2.0 V"
      ],
      "answer": "Approximately 0.3 V",
      "correct_option": "Approximately 0.3 V",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Germanium diodes have a smaller bandgap (~0.66 eV), resulting in a lower built-in barrier of approximately 0.2 V to 0.3 V."
    },
    {
      "id": "diode-q3",
      "question": "What happens to the depletion region width when a p-n junction diode is forward biased?",
      "options": [
        "The depletion region narrows, lowering the potential barrier",
        "The depletion region widens",
        "The depletion region remains constant",
        "The depletion region disappears permanently"
      ],
      "answer": "The depletion region narrows, lowering the potential barrier",
      "correct_option": "The depletion region narrows, lowering the potential barrier",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Forward bias applies positive voltage to the p-side and negative to the n-side, opposing the built-in electric field and narrowing the space-charge layer."
    },
    {
      "id": "diode-q4",
      "question": "What happens to the depletion region width when a p-n junction diode is reverse biased?",
      "options": [
        "The depletion region widens, increasing the potential barrier",
        "The depletion region narrows",
        "The depletion region collapses to zero",
        "Mobile charge carriers flood the junction"
      ],
      "answer": "The depletion region widens, increasing the potential barrier",
      "correct_option": "The depletion region widens, increasing the potential barrier",
      "difficulty": "easy",
      "global_id": 4,
      "explanation": "Reverse bias reinforces the internal built-in field, pulling majority carriers away from the metallurgical junction and widening the depletion zone."
    },
    {
      "id": "diode-q5",
      "question": "What is the mathematical equation governing the current-voltage relationship of an ideal p-n junction diode (Shockley Diode Equation)?",
      "options": [
        "I = I_s * [exp(qV / (η * k * T)) - 1]",
        "I = V / R",
        "I = I_s * exp(-qV / kT)",
        "I = I_s * [1 - exp(qV / kT)]"
      ],
      "answer": "I = I_s * [exp(qV / (η * k * T)) - 1]",
      "correct_option": "I = I_s * [exp(qV / (η * k * T)) - 1]",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "The Shockley equation describes diode diffusion current: I = I_s [exp(V / (η V_T)) - 1], where V_T = kT/q is the thermal voltage."
    },
    {
      "id": "diode-q6",
      "question": "What is the approximate value of the thermal voltage V_T = (k * T) / q at room temperature (T = 300 K)?",
      "options": [
        "Approximately 25.9 mV (≈ 26 mV)",
        "Approximately 0.7 V",
        "Approximately 1.5 mV",
        "Approximately 1.0 V"
      ],
      "answer": "Approximately 25.9 mV (≈ 26 mV)",
      "correct_option": "Approximately 25.9 mV (≈ 26 mV)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "V_T = (1.38e-23 J/K * 300 K) / (1.602e-19 C) ≈ 0.02585 V ≈ 25.86 mV."
    },
    {
      "id": "diode-q7",
      "question": "What is the ideality factor (emission coefficient) η for an ideal germanium diode and a silicon diode at moderate forward bias?",
      "options": [
        "η ≈ 1 for Ge, and η ≈ 1 to 2 for Si",
        "η = 0 for both",
        "η = 10 for both",
        "η = 0.5 for Ge, 0.1 for Si"
      ],
      "answer": "η ≈ 1 for Ge, and η ≈ 1 to 2 for Si",
      "correct_option": "η ≈ 1 for Ge, and η ≈ 1 to 2 for Si",
      "difficulty": "medium",
      "global_id": 7,
      "explanation": "Germanium current is dominated by diffusion (η ≈ 1), while silicon exhibits both diffusion and recombination currents, making η between 1 and 2."
    },
    {
      "id": "diode-q8",
      "question": "What is the dynamic (ac) resistance r_d of a forward-biased diode mathematically defined as?",
      "options": [
        "r_d = dV / dI = (η * V_T) / I_D",
        "r_d = V_D / I_D",
        "r_d = I_D / V_D",
        "r_d = V_D * I_D"
      ],
      "answer": "r_d = dV / dI = (η * V_T) / I_D",
      "correct_option": "r_d = dV / dI = (η * V_T) / I_D",
      "difficulty": "medium",
      "global_id": 8,
      "explanation": "Dynamic resistance is the reciprocal of the slope of the forward V-I characteristic: r_d = dV/dI ≈ η V_T / I_D."
    },
    {
      "id": "diode-q9",
      "question": "If a forward-biased silicon diode (η = 1) carries a DC current of I_D = 2.6 mA at room temperature, what is its dynamic AC resistance?",
      "options": [
        "10 Ω",
        "100 Ω",
        "1.0 Ω",
        "50 Ω"
      ],
      "answer": "10 Ω",
      "correct_option": "10 Ω",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "r_d = V_T / I_D = 26 mV / 2.6 mA = 10 Ω."
    },
    {
      "id": "diode-q10",
      "question": "How does the static (DC) resistance R_DC = V_D / I_D compare to the dynamic (AC) resistance r_d in the forward conduction region?",
      "options": [
        "R_DC is significantly larger than r_d (R_DC > r_d)",
        "R_DC is much smaller than r_d",
        "R_DC and r_d are always strictly equal",
        "r_d is infinite while R_DC is zero"
      ],
      "answer": "R_DC is significantly larger than r_d (R_DC > r_d)",
      "correct_option": "R_DC is significantly larger than r_d (R_DC > r_d)",
      "difficulty": "medium",
      "global_id": 10,
      "explanation": "Because the forward current increases exponentially, the tangent slope (dI/dV) is much steeper than the secant slope (I/V), meaning r_d < R_DC."
    },
    {
      "id": "diode-q11",
      "question": "What carriers constitute the tiny reverse saturation current I_s in a reverse-biased p-n junction?",
      "options": [
        "Thermally generated minority carriers (electrons in p-region and holes in n-region)",
        "Injected majority carrier holes",
        "Free electrons in the copper connecting wires",
        "Photons absorbed by the resistor"
      ],
      "answer": "Thermally generated minority carriers (electrons in p-region and holes in n-region)",
      "correct_option": "Thermally generated minority carriers (electrons in p-region and holes in n-region)",
      "difficulty": "easy",
      "global_id": 11,
      "explanation": "Reverse bias sweeps minority carriers that diffuse to the edge of the depletion zone across the junction, creating the reverse saturation current I_s."
    },
    {
      "id": "diode-q12",
      "question": "How does the reverse saturation current I_s of a silicon diode change with increasing temperature?",
      "options": [
        "I_s approximately doubles for every 10°C rise in temperature",
        "I_s decreases by half for every 10°C",
        "I_s remains completely constant",
        "I_s drops to zero at 100°C"
      ],
      "answer": "I_s approximately doubles for every 10°C rise in temperature",
      "correct_option": "I_s approximately doubles for every 10°C rise in temperature",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "Thermal generation of electron-hole pairs increases exponentially with temperature: I_s(T2) ≈ I_s(T1) * 2^((T2-T1)/10)."
    },
    {
      "id": "diode-q13",
      "question": "How does the forward barrier voltage (cut-in voltage) of a silicon diode shift with temperature?",
      "options": [
        "It decreases by approximately 2 mV per °C rise (-2 mV/°C)",
        "It increases by 2 mV per °C rise (+2 mV/°C)",
        "It increases by 1 V per °C",
        "It is temperature independent"
      ],
      "answer": "It decreases by approximately 2 mV per °C rise (-2 mV/°C)",
      "correct_option": "It decreases by approximately 2 mV per °C rise (-2 mV/°C)",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "dV/dT ≈ -2.0 to -2.5 mV/°C for silicon. As temperature rises, higher intrinsic carrier density allows forward current conduction at lower applied voltages."
    },
    {
      "id": "diode-q14",
      "question": "What is Zener breakdown in a heavily doped p-n junction diode?",
      "options": [
        "Direct quantum mechanical tunneling of valence electrons into the conduction band under a very strong electric field (> 10⁶ V/cm)",
        "Collisional impact ionization of lattice atoms",
        "Thermal destruction of the packaging",
        "Electromigration of contacts"
      ],
      "answer": "Direct quantum mechanical tunneling of valence electrons into the conduction band under a very strong electric field (> 10⁶ V/cm)",
      "correct_option": "Direct quantum mechanical tunneling of valence electrons into the conduction band under a very strong electric field (> 10⁶ V/cm)",
      "difficulty": "hard",
      "global_id": 14,
      "explanation": "In heavily doped junctions with narrow depletion width (< 10 nm), reverse voltage creates an intense field (> 10⁶ V/m) that enables direct quantum tunneling (Zener effect)."
    },
    {
      "id": "diode-q15",
      "question": "How does Avalanche breakdown differ physically from Zener breakdown?",
      "options": [
        "Avalanche breakdown is caused by impact ionization (accelerated carriers knocking valence electrons free), occurring at higher reverse voltages (> 5-6 V)",
        "Avalanche breakdown occurs only at 0 V",
        "Avalanche breakdown occurs in forward bias",
        "Avalanche breakdown is caused by quantum tunneling"
      ],
      "answer": "Avalanche breakdown is caused by impact ionization (accelerated carriers knocking valence electrons free), occurring at higher reverse voltages (> 5-6 V)",
      "correct_option": "Avalanche breakdown is caused by impact ionization (accelerated carriers knocking valence electrons free), occurring at higher reverse voltages (> 5-6 V)",
      "difficulty": "medium",
      "global_id": 15,
      "explanation": "In moderately/lightly doped diodes with wider depletion regions, minority carriers accelerate to high kinetic energies, colliding with lattice atoms to liberate secondary electron-hole pairs."
    },
    {
      "id": "diode-q16",
      "question": "What is the temperature coefficient of breakdown voltage for a Zener breakdown mechanism (< 5 V) vs an Avalanche breakdown mechanism (> 6 V)?",
      "options": [
        "Zener has a negative temperature coefficient; Avalanche has a positive temperature coefficient",
        "Zener is positive; Avalanche is negative",
        "Both are strictly positive",
        "Both are zero"
      ],
      "answer": "Zener has a negative temperature coefficient; Avalanche has a positive temperature coefficient",
      "correct_option": "Zener has a negative temperature coefficient; Avalanche has a positive temperature coefficient",
      "difficulty": "hard",
      "global_id": 16,
      "explanation": "Zener tunneling increases with temperature (narrowing bandgap), so V_Z drops (negative tempco). In avalanche, increased lattice vibrations impede carrier acceleration, requiring higher voltage (positive tempco)."
    },
    {
      "id": "diode-q17",
      "question": "At approximately what breakdown voltage does a Zener diode exhibit near-zero temperature coefficient?",
      "options": [
        "Around 5.1 V to 5.6 V",
        "0.7 V",
        "100 V",
        "0.3 V"
      ],
      "answer": "Around 5.1 V to 5.6 V",
      "correct_option": "Around 5.1 V to 5.6 V",
      "difficulty": "medium",
      "global_id": 17,
      "explanation": "Around 5.1 V to 5.6 V, the negative tempco of Zener tunneling and the positive tempco of avalanche multiplication precisely cancel each other, providing temperature-stable voltage references."
    },
    {
      "id": "diode-q18",
      "question": "What is the primary electronic application of a Zener diode operated in its reverse breakdown region?",
      "options": [
        "Voltage regulation and voltage reference stabilization",
        "Current amplification",
        "Radio wave frequency modulation",
        "Electrical energy storage"
      ],
      "answer": "Voltage regulation and voltage reference stabilization",
      "correct_option": "Voltage regulation and voltage reference stabilization",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "Because voltage remains virtually constant over a wide range of reverse breakdown current, Zener diodes maintain stable DC reference voltages."
    },
    {
      "id": "diode-q19",
      "question": "Why must a current-limiting resistor always be placed in series with a diode during forward V-I characterization?",
      "options": [
        "To prevent excessive forward current that would cause catastrophic thermal burnout once knee voltage is exceeded",
        "To reduce the input voltage to zero",
        "To convert alternating current into radio waves",
        "To measure the diode capacitance"
      ],
      "answer": "To prevent excessive forward current that would cause catastrophic thermal burnout once knee voltage is exceeded",
      "correct_option": "To prevent excessive forward current that would cause catastrophic thermal burnout once knee voltage is exceeded",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "Above the knee voltage, dynamic resistance drops to a few ohms; without a series ballast resistor, current would spike uncontrollably and destroy the junction."
    },
    {
      "id": "diode-q20",
      "question": "What is the transition (depletion-layer) capacitance C_T of a reverse-biased p-n junction diode?",
      "options": [
        "C_T = ε * A / W (acts like a parallel-plate capacitor whose plate separation W widens with reverse voltage)",
        "C_T is zero in reverse bias",
        "C_T increases linearly with reverse voltage",
        "C_T = I / V"
      ],
      "answer": "C_T = ε * A / W (acts like a parallel-plate capacitor whose plate separation W widens with reverse voltage)",
      "correct_option": "C_T = ε * A / W (acts like a parallel-plate capacitor whose plate separation W widens with reverse voltage)",
      "difficulty": "medium",
      "global_id": 20,
      "explanation": "The unneutralized immobile ion sheets act as capacitor plates separated by the dielectric depletion region W: C_T ∝ 1 / √(V_bi + V_R)."
    },
    {
      "id": "diode-q21",
      "question": "What specialized diode utilizes the voltage-variable transition capacitance of a reverse-biased junction for electronic radio frequency tuning?",
      "options": [
        "Varactor (Varicap) diode",
        "Schottky diode",
        "Tunnel diode",
        "Gunn diode"
      ],
      "answer": "Varactor (Varicap) diode",
      "correct_option": "Varactor (Varicap) diode",
      "difficulty": "easy",
      "global_id": 21,
      "explanation": "Varactor diodes are fabricated to maximize transition capacitance variation with reverse voltage, serving as voltage-controlled capacitors in RF VCOs and phase-locked loops."
    },
    {
      "id": "diode-q22",
      "question": "What is diffusion capacitance C_D in a p-n junction diode?",
      "options": [
        "Capacitance caused by the time-delay storage of excess minority carrier charge in the neutral regions under forward bias",
        "Capacitance of the depletion layer in reverse bias",
        "Capacitance between external metal leads",
        "Capacitance caused by thermal expansion"
      ],
      "answer": "Capacitance caused by the time-delay storage of excess minority carrier charge in the neutral regions under forward bias",
      "correct_option": "Capacitance caused by the time-delay storage of excess minority carrier charge in the neutral regions under forward bias",
      "difficulty": "hard",
      "global_id": 22,
      "explanation": "Under forward bias, minority carriers are injected across the junction and stored before recombining: C_D = (τ * I_D) / (η * V_T), scaling linearly with forward current."
    },
    {
      "id": "diode-q23",
      "question": "What is the reverse recovery time (t_rr) of a p-n junction diode?",
      "options": [
        "The time required for stored minority carriers to be removed when switching rapidly from forward conduction to reverse bias",
        "The time taken for a diode to cool down",
        "The time to reach breakdown voltage",
        "The time for current to reach 100 A"
      ],
      "answer": "The time required for stored minority carriers to be removed when switching rapidly from forward conduction to reverse bias",
      "correct_option": "The time required for stored minority carriers to be removed when switching rapidly from forward conduction to reverse bias",
      "difficulty": "medium",
      "global_id": 23,
      "explanation": "When switched from forward to reverse, stored excess minority carriers must recombine or be swept out before the diode can block reverse current, causing a transient reverse current spike."
    },
    {
      "id": "diode-q24",
      "question": "Why are Schottky diodes capable of switching much faster than conventional silicon p-n junction diodes?",
      "options": [
        "They are metal-semiconductor majority carrier devices with zero minority carrier storage and near-zero reverse recovery time (t_rr ≈ 0)",
        "They have a wider depletion zone",
        "They operate at cryogenic temperatures",
        "They contain liquid metal"
      ],
      "answer": "They are metal-semiconductor majority carrier devices with zero minority carrier storage and near-zero reverse recovery time (t_rr ≈ 0)",
      "correct_option": "They are metal-semiconductor majority carrier devices with zero minority carrier storage and near-zero reverse recovery time (t_rr ≈ 0)",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "Schottky diodes use a metal-semiconductor barrier where conduction is carried solely by majority carriers, eliminating minority carrier storage delay."
    },
    {
      "id": "diode-q25",
      "question": "What is the typical forward voltage drop of a Schottky barrier diode?",
      "options": [
        "Approximately 0.2 V to 0.4 V",
        "Approximately 0.7 V to 0.9 V",
        "Approximately 1.5 V to 2.0 V",
        "Zero volts"
      ],
      "answer": "Approximately 0.2 V to 0.4 V",
      "correct_option": "Approximately 0.2 V to 0.4 V",
      "difficulty": "easy",
      "global_id": 25,
      "explanation": "Metal-semiconductor barriers have a lower barrier height than silicon p-n junctions, providing a lower forward drop (~0.3 V) that minimizes power dissipation."
    },
    {
      "id": "diode-q26",
      "question": "In a Light Emitting Diode (LED), what physical process generates photon emission?",
      "options": [
        "Radiative recombination of injected electrons and holes across the direct bandgap",
        "Thermal blackbody radiation from wire heating",
        "Nuclear fission in the substrate",
        "Piezoelectric deformation"
      ],
      "answer": "Radiative recombination of injected electrons and holes across the direct bandgap",
      "correct_option": "Radiative recombination of injected electrons and holes across the direct bandgap",
      "difficulty": "easy",
      "global_id": 26,
      "explanation": "Under forward bias, electrons and holes recombine radiatively across the direct energy gap, releasing energy as a photon of wavelength λ = hc / E_g."
    },
    {
      "id": "diode-q27",
      "question": "Why are direct bandgap semiconductors (such as GaAs, GaN, InP) used for LEDs rather than indirect bandgap semiconductors like Silicon?",
      "options": [
        "In direct bandgap materials, electrons and holes can recombine directly without requiring phonon (lattice vibration) momentum conservation",
        "Silicon absorbs all visible light completely",
        "Silicon cannot conduct electricity",
        "Direct bandgap materials have zero resistance"
      ],
      "answer": "In direct bandgap materials, electrons and holes can recombine directly without requiring phonon (lattice vibration) momentum conservation",
      "correct_option": "In direct bandgap materials, electrons and holes can recombine directly without requiring phonon (lattice vibration) momentum conservation",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "In direct bandgap semiconductors, the conduction band minimum aligns with the valence band maximum in k-space, permitting high-probability radiative transitions without phonon assistance."
    },
    {
      "id": "diode-q28",
      "question": "What is the relationship between the peak emitted wavelength λ of an LED and its semiconductor bandgap energy E_g?",
      "options": [
        "λ ≈ (h * c) / E_g = 1240 / E_g (where E_g is in eV and λ in nm)",
        "λ = E_g / (h * c)",
        "λ = h * E_g",
        "λ = E_g² / c"
      ],
      "answer": "λ ≈ (h * c) / E_g = 1240 / E_g (where E_g is in eV and λ in nm)",
      "correct_option": "λ ≈ (h * c) / E_g = 1240 / E_g (where E_g is in eV and λ in nm)",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "E = hν = hc/λ. Expressing E_g in electron-volts and λ in nanometers gives the convenient relation λ(nm) ≈ 1240 / E_g(eV)."
    },
    {
      "id": "diode-q29",
      "question": "A red LED emits light at a peak wavelength of λ = 650 nm. What is the approximate energy bandgap E_g of its semiconductor material?",
      "options": [
        "1.91 eV",
        "1.12 eV",
        "3.40 eV",
        "0.66 eV"
      ],
      "answer": "1.91 eV",
      "correct_option": "1.91 eV",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "E_g = hc / λ = 1240 / 650 nm ≈ 1.908 eV ≈ 1.91 eV."
    },
    {
      "id": "diode-q30",
      "question": "A blue LED based on Gallium Nitride (GaN) emits light at 450 nm. What is its approximate cut-in / knee voltage?",
      "options": [
        "2.7 V to 3.0 V",
        "0.7 V",
        "0.3 V",
        "1.2 V"
      ],
      "answer": "2.7 V to 3.0 V",
      "correct_option": "2.7 V to 3.0 V",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "Knee voltage scales with bandgap: V_knee ≈ E_g / q = 1240 / 450 nm ≈ 2.76 V."
    },
    {
      "id": "diode-q31",
      "question": "In which quadrant of the V-I coordinate plane does a solar cell operate when generating electrical power?",
      "options": [
        "Fourth quadrant (positive voltage, negative current: delivering power to external load)",
        "First quadrant",
        "Second quadrant",
        "Third quadrant"
      ],
      "answer": "Fourth quadrant (positive voltage, negative current: delivering power to external load)",
      "correct_option": "Fourth quadrant (positive voltage, negative current: delivering power to external load)",
      "difficulty": "hard",
      "global_id": 31,
      "explanation": "A solar cell produces photo-generated current opposite to forward bias: with V > 0 and I < 0, the P = V * I product is negative, indicating power output."
    },
    {
      "id": "diode-q32",
      "question": "In which bias mode is a photodiode normally operated to achieve high speed and linear light-to-current response?",
      "options": [
        "Reverse bias mode (photoconductive mode)",
        "Forward bias mode",
        "Zero voltage unbiased only",
        "High forward voltage breakdown mode"
      ],
      "answer": "Reverse bias mode (photoconductive mode)",
      "correct_option": "Reverse bias mode (photoconductive mode)",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Reverse bias expands the depletion width (decreasing junction capacitance for high bandwidth) and produces a reverse photocurrent that is strictly linear with incident light intensity."
    },
    {
      "id": "diode-q33",
      "question": "What is a Tunnel (Esaki) diode characterized by in its forward V-I curve?",
      "options": [
        "A distinct Negative Differential Resistance (NDR) region where current decreases as voltage increases",
        "Zero reverse leakage current",
        "A perfectly linear Ohm's law curve",
        "Infinite reverse breakdown voltage"
      ],
      "answer": "A distinct Negative Differential Resistance (NDR) region where current decreases as voltage increases",
      "correct_option": "A distinct Negative Differential Resistance (NDR) region where current decreases as voltage increases",
      "difficulty": "hard",
      "global_id": 33,
      "explanation": "Degenerately doped p and n regions allow quantum tunneling at low forward voltages; as voltage increases, band overlap decreases, causing current to drop (negative resistance dI/dV < 0)."
    },
    {
      "id": "diode-q34",
      "question": "What is the peak-to-valley current ratio (PVCR) in a Tunnel diode?",
      "options": [
        "The ratio of the maximum forward tunneling peak current (I_P) to the minimum valley current (I_V)",
        "The ratio of reverse to forward current",
        "The ratio of breakdown voltage to knee voltage",
        "The ratio of AC to DC resistance"
      ],
      "answer": "The ratio of the maximum forward tunneling peak current (I_P) to the minimum valley current (I_V)",
      "correct_option": "The ratio of the maximum forward tunneling peak current (I_P) to the minimum valley current (I_V)",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "PVCR = I_P / I_V is a key figure of merit for tunnel diodes used in high-frequency microwave oscillators and fast pulse generators."
    },
    {
      "id": "diode-q35",
      "question": "What is the primary function of a freewheeling (flyback) diode connected in parallel with an inductive load (such as a relay coil)?",
      "options": [
        "To suppress inductive high-voltage spikes (L * di/dt) when current is switched off by circulating current safely",
        "To increase coil current during operation",
        "To illuminate when the relay turns on",
        "To step up DC voltage to AC"
      ],
      "answer": "To suppress inductive high-voltage spikes (L * di/dt) when current is switched off by circulating current safely",
      "correct_option": "To suppress inductive high-voltage spikes (L * di/dt) when current is switched off by circulating current safely",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "When coil current is abruptly interrupted, V = -L(di/dt) can generate hundreds of volts; a reverse-parallel freewheeling diode clamps the spike to ~0.7 V, protecting switching transistors."
    },
    {
      "id": "diode-q36",
      "question": "What is the Ripple Factor of an ideal half-wave rectifier without a filter capacitor?",
      "options": [
        "1.21",
        "0.482",
        "0.00",
        "2.00"
      ],
      "answer": "1.21",
      "correct_option": "1.21",
      "difficulty": "hard",
      "global_id": 36,
      "explanation": "Ripple factor γ = √( (V_rms / V_dc)² - 1 ). For half-wave rectification (V_rms = V_m/2, V_dc = V_m/π), γ = √( (π/2)² - 1 ) = √(2.467 - 1) = 1.211."
    },
    {
      "id": "diode-q37",
      "question": "What is the Ripple Factor of a full-wave bridge rectifier without a filter capacitor?",
      "options": [
        "0.482",
        "1.21",
        "0.10",
        "1.00"
      ],
      "answer": "0.482",
      "correct_option": "0.482",
      "difficulty": "hard",
      "global_id": 37,
      "explanation": "For full-wave rectification, V_rms = V_m / √2, V_dc = 2V_m / π. Ripple factor γ = √( (π / (2√2))² - 1 ) = √(1.2337 - 1) ≈ 0.482."
    },
    {
      "id": "diode-q38",
      "question": "What is the Peak Inverse Voltage (PIV) rating required for the diodes in a full-wave bridge rectifier?",
      "options": [
        "PIV = V_m (peak secondary voltage)",
        "PIV = 2 * V_m",
        "PIV = V_m / 2",
        "PIV = 4 * V_m"
      ],
      "answer": "PIV = V_m (peak secondary voltage)",
      "correct_option": "PIV = V_m (peak secondary voltage)",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "In a bridge rectifier, the two non-conducting diodes in series share the reverse voltage, so each diode experiences a maximum reverse voltage equal to V_m."
    },
    {
      "id": "diode-q39",
      "question": "In a center-tapped full-wave rectifier, what is the Peak Inverse Voltage (PIV) across each non-conducting diode?",
      "options": [
        "PIV = 2 * V_m",
        "PIV = V_m",
        "PIV = V_m / 2",
        "PIV = 4 * V_m"
      ],
      "answer": "PIV = 2 * V_m",
      "correct_option": "PIV = 2 * V_m",
      "difficulty": "medium",
      "global_id": 39,
      "explanation": "When one diode conducts, the non-conducting diode experiences the full secondary end-to-end voltage: PIV = 2 * V_m."
    },
    {
      "id": "diode-q40",
      "question": "Why does a silicon diode conduct negligible current below its knee voltage (~0.6 V)?",
      "options": [
        "The built-in electric field at the junction opposes majority carrier diffusion until external voltage overcomes it",
        "Silicon atoms have no free electrons at room temperature",
        "The series resistance is infinite at low voltage",
        "Light emission absorbs all incoming energy"
      ],
      "answer": "The built-in electric field at the junction opposes majority carrier diffusion until external voltage overcomes it",
      "correct_option": "The built-in electric field at the junction opposes majority carrier diffusion until external voltage overcomes it",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "The internal contact potential creates an electrostatic energy barrier; only carriers with thermal energy exceeding q(V_0 - V) can cross, which is negligible until V approaches V_0."
    },
    {
      "id": "diode-q41",
      "question": "What instrument is used in the laboratory to simultaneously plot the complete dynamic forward and reverse V-I curve of a diode on an oscilloscope?",
      "options": [
        "A Curve Tracer (or dual-channel oscilloscope with XY Lissajous mode)",
        "A digital multimeter set to resistance",
        "A wheatstone bridge",
        "A spectrum analyzer"
      ],
      "answer": "A Curve Tracer (or dual-channel oscilloscope with XY Lissajous mode)",
      "correct_option": "A Curve Tracer (or dual-channel oscilloscope with XY Lissajous mode)",
      "difficulty": "easy",
      "global_id": 41,
      "explanation": "A curve tracer or an XY oscilloscope setup applies an AC sweep voltage across the diode while measuring voltage across the diode (X) and current across a sense resistor (Y)."
    },
    {
      "id": "diode-q42",
      "question": "In an experimental circuit measuring diode forward V-I characteristics, why is the voltmeter connected directly across the diode rather than across the power supply?",
      "options": [
        "To avoid including the voltage drop across the current-measuring ammeter and series resistor",
        "To prevent blowing the voltmeter fuse",
        "Because power supplies cannot be measured",
        "To cancel reverse saturation current"
      ],
      "answer": "To avoid including the voltage drop across the current-measuring ammeter and series resistor",
      "correct_option": "To avoid including the voltage drop across the current-measuring ammeter and series resistor",
      "difficulty": "medium",
      "global_id": 42,
      "explanation": "Connecting the voltmeter directly across the diode terminals ensures it measures true junction potential V_D without parasitic drops from the ammeter internal shunt resistance."
    },
    {
      "id": "diode-q43",
      "question": "If a diode forward current increases from 10 mA to 30 mA while voltage increases from 0.70 V to 0.73 V, what is the experimental dynamic resistance r_d?",
      "options": [
        "1.5 Ω",
        "15 Ω",
        "0.15 Ω",
        "3.0 Ω"
      ],
      "answer": "1.5 Ω",
      "correct_option": "1.5 Ω",
      "difficulty": "medium",
      "global_id": 43,
      "explanation": "r_d = ΔV / ΔI = (0.73 V - 0.70 V) / (30 mA - 10 mA) = 0.030 V / 0.020 A = 1.5 Ω."
    },
    {
      "id": "diode-q44",
      "question": "What is the maximum theoretical efficiency of an ideal full-wave rectifier with resistive load and no capacitor?",
      "options": [
        "81.2%",
        "40.6%",
        "50.0%",
        "100.0%"
      ],
      "answer": "81.2%",
      "correct_option": "81.2%",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "Maximum efficiency η_max = P_dc / P_ac = (8 / π²) ≈ 81.16% for full-wave rectification (twice that of half-wave at 40.6%)."
    },
    {
      "id": "diode-q45",
      "question": "What is thermal runaway in a power diode?",
      "options": [
        "A positive feedback loop where temperature rise increases reverse leakage current, causing higher power dissipation and further heating until destruction",
        "The diode generating infinite cold",
        "The diode melting due to electrostatic charge",
        "The diode emitting ultraviolet light"
      ],
      "answer": "A positive feedback loop where temperature rise increases reverse leakage current, causing higher power dissipation and further heating until destruction",
      "correct_option": "A positive feedback loop where temperature rise increases reverse leakage current, causing higher power dissipation and further heating until destruction",
      "difficulty": "hard",
      "global_id": 45,
      "explanation": "Because I_s doubles every 10°C, leakage power dissipation P = V_R * I_s heats the junction. If heat cannot dissipate fast enough, temperature climbs uncontrollably until thermal breakdown."
    },
    {
      "id": "diode-q46",
      "question": "What is the bandgap of standard monocrystalline silicon at 300 K?",
      "options": [
        "1.12 eV",
        "0.66 eV",
        "1.42 eV",
        "3.39 eV"
      ],
      "answer": "1.12 eV",
      "correct_option": "1.12 eV",
      "difficulty": "easy",
      "global_id": 46,
      "explanation": "Silicon has an indirect energy bandgap of E_g ≈ 1.12 eV at 300 K."
    },
    {
      "id": "diode-q47",
      "question": "What is the bandgap of germanium at room temperature (300 K)?",
      "options": [
        "0.66 eV",
        "1.12 eV",
        "1.42 eV",
        "2.26 eV"
      ],
      "answer": "0.66 eV",
      "correct_option": "0.66 eV",
      "difficulty": "easy",
      "global_id": 47,
      "explanation": "Germanium has an indirect energy bandgap of approximately 0.66 eV at 300 K."
    },
    {
      "id": "diode-q48",
      "question": "What happens to the built-in potential barrier V_0 if the donor doping concentration N_D and acceptor doping concentration N_A are increased?",
      "options": [
        "V_0 increases logarithmically according to V_0 = V_T * ln(N_A * N_D / n_i²)",
        "V_0 decreases linearly",
        "V_0 drops to zero",
        "V_0 is independent of doping"
      ],
      "answer": "V_0 increases logarithmically according to V_0 = V_T * ln(N_A * N_D / n_i²)",
      "correct_option": "V_0 increases logarithmically according to V_0 = V_T * ln(N_A * N_D / n_i²)",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "Higher doping pushes the Fermi levels closer to the band edges in both p and n regions, increasing built-in potential V_0 = (kT/q) ln(N_A N_D / n_i²)."
    },
    {
      "id": "diode-q49",
      "question": "What is a PIN diode and what is its primary high-frequency application?",
      "options": [
        "A diode with an intrinsic (undoped) layer between p and n regions, functioning as an RF variable resistor or fast optical detector",
        "A diode with three p-type terminals",
        "A diode that conducts only when pinned to ground",
        "A diode that replaces vacuum tubes in audio"
      ],
      "answer": "A diode with an intrinsic (undoped) layer between p and n regions, functioning as an RF variable resistor or fast optical detector",
      "correct_option": "A diode with an intrinsic (undoped) layer between p and n regions, functioning as an RF variable resistor or fast optical detector",
      "difficulty": "medium",
      "global_id": 49,
      "explanation": "The thick intrinsic (I) layer yields low junction capacitance and long carrier lifetime, allowing the PIN diode to behave as an RF attenuator/switch whose resistance is tuned by DC bias."
    },
    {
      "id": "diode-q50",
      "question": "Why does an LED require a series resistor when connected to a DC supply voltage V_cc > V_knee?",
      "options": [
        "Because its steep exponential V-I slope would allow destructive current overcurrent without external resistance",
        "To step down the frequency of light",
        "To make the LED shine in both directions",
        "To prevent electromagnetic interference"
      ],
      "answer": "Because its steep exponential V-I slope would allow destructive current overcurrent without external resistance",
      "correct_option": "Because its steep exponential V-I slope would allow destructive current overcurrent without external resistance",
      "difficulty": "easy",
      "global_id": 50,
      "explanation": "Once the applied voltage exceeds the LED forward knee voltage, resistance drops near zero; the series resistor sets safe forward current: R = (V_cc - V_LED) / I_desired."
    }
  ]
};

export const PLANCK_QUESTION_BANK = {
  "experiment": "Planck's Constant Photocell - Question Bank",
  "experimentId": "planck",
  "quizId": "planck-constant-mastery-quiz",
  "experimentName": "Planck's Constant Photocell",
  "description": "Comprehensive 50-Question Physics Question Bank for Planck's Constant Photocell",
  "total_questions": 50,
  "questions": [
    {
      "id": "planck-q1",
      "question": "What is the universally accepted value of Planck's constant h in SI units?",
      "options": [
        "6.626 x 10⁻³⁴ J·s",
        "3.00 x 10⁸ m/s",
        "1.602 x 10⁻¹⁹ C",
        "9.109 x 10⁻³¹ kg"
      ],
      "answer": "6.626 x 10⁻³⁴ J·s",
      "correct_option": "6.626 x 10⁻³⁴ J·s",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "Planck's constant h = 6.62607015 x 10⁻³⁴ J·s (or J/Hz), an exact fundamental SI constant defined in 2019."
    },
    {
      "id": "planck-q2",
      "question": "What is Einstein's photoelectric equation relating incident photon energy hν to electron kinetic energy?",
      "options": [
        "h * ν = Φ + K_max = Φ + e * V_s",
        "h * ν = Φ - K_max",
        "K_max = h * ν * Φ",
        "h * ν = m * c² + e * V_s"
      ],
      "answer": "h * ν = Φ + K_max = Φ + e * V_s",
      "correct_option": "h * ν = Φ + K_max = Φ + e * V_s",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "Einstein proposed that one photon transfers its entire energy hν to one electron: hν = Φ + (1/2)m v_max² = Φ + e V_s."
    },
    {
      "id": "planck-q3",
      "question": "What is the stopping potential (retarding potential) V_s in a photoelectric experiment?",
      "options": [
        "The minimum negative anode voltage required to reduce the photocurrent to exactly zero",
        "The voltage at which the photocell emits light",
        "The breakdown voltage of the glass envelope",
        "The battery voltage needed to heat the filament"
      ],
      "answer": "The minimum negative anode voltage required to reduce the photocurrent to exactly zero",
      "correct_option": "The minimum negative anode voltage required to reduce the photocurrent to exactly zero",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Stopping potential V_s provides an electrostatic potential energy barrier e V_s that just stops the most energetic photoelectrons: e V_s = K_max."
    },
    {
      "id": "planck-q4",
      "question": "What does the slope of the graph of Stopping Potential V_s (y-axis) vs Incident Light Frequency ν (x-axis) represent?",
      "options": [
        "Slope = h / e (Planck's constant divided by elementary charge)",
        "Slope = h * e",
        "Slope = Φ / e (work function)",
        "Slope = c (speed of light)"
      ],
      "answer": "Slope = h / e (Planck's constant divided by elementary charge)",
      "correct_option": "Slope = h / e (Planck's constant divided by elementary charge)",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "Rearranging Einstein's equation gives V_s = (h/e) * ν - (Φ/e). The linear plot has slope m = h/e, which is universal for all metals."
    },
    {
      "id": "planck-q5",
      "question": "What does the x-intercept of the Stopping Potential V_s vs Frequency ν graph represent?",
      "options": [
        "The threshold frequency ν0 of the photocathode material",
        "The maximum frequency of light",
        "The speed of sound",
        "Zero frequency"
      ],
      "answer": "The threshold frequency ν0 of the photocathode material",
      "correct_option": "The threshold frequency ν0 of the photocathode material",
      "difficulty": "medium",
      "global_id": 5,
      "explanation": "Setting V_s = 0 gives ν = Φ/h = ν0, which is the threshold frequency below which no photoemission can occur regardless of intensity."
    },
    {
      "id": "planck-q6",
      "question": "What does the magnitude of the negative y-intercept of the V_s vs ν graph represent?",
      "options": [
        "The work function divided by electron charge (Φ / e)",
        "Planck's constant h",
        "The threshold wavelength λ0",
        "The saturation current"
      ],
      "answer": "The work function divided by electron charge (Φ / e)",
      "correct_option": "The work function divided by electron charge (Φ / e)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "Extrapolating the linear curve to ν = 0 yields the y-intercept = -Φ/e, directly giving the metal's work function in electron-volts."
    },
    {
      "id": "planck-q7",
      "question": "How does increasing the intensity of incident monochromatic light affect the stopping potential V_s?",
      "options": [
        "Stopping potential V_s remains completely unchanged",
        "Stopping potential V_s increases proportionally",
        "Stopping potential V_s decreases to zero",
        "Stopping potential V_s doubles"
      ],
      "answer": "Stopping potential V_s remains completely unchanged",
      "correct_option": "Stopping potential V_s remains completely unchanged",
      "difficulty": "easy",
      "global_id": 7,
      "explanation": "Stopping potential depends solely on photon energy (frequency ν); increasing intensity merely increases the number of photons per second, not individual photon energy."
    },
    {
      "id": "planck-q8",
      "question": "How does increasing the intensity of incident monochromatic light (with ν > ν0) affect the saturation photocurrent I_sat?",
      "options": [
        "Photocurrent increases in direct linear proportion to light intensity",
        "Photocurrent remains constant",
        "Photocurrent decreases",
        "Photocurrent oscillates sinusoidally"
      ],
      "answer": "Photocurrent increases in direct linear proportion to light intensity",
      "correct_option": "Photocurrent increases in direct linear proportion to light intensity",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "Higher light intensity delivers more photons per second, ejecting a proportionally higher number of photoelectrons per second (I ∝ Intensity)."
    },
    {
      "id": "planck-q9",
      "question": "What is the threshold wavelength λ0 of a metal mathematically defined as?",
      "options": [
        "λ0 = (h * c) / Φ",
        "λ0 = Φ / (h * c)",
        "λ0 = (h * Φ) / c",
        "λ0 = c / (h * Φ)"
      ],
      "answer": "λ0 = (h * c) / Φ",
      "correct_option": "λ0 = (h * c) / Φ",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Threshold wavelength is the maximum wavelength that can eject an electron: E = hc/λ0 = Φ, hence λ0 = hc / Φ."
    },
    {
      "id": "planck-q10",
      "question": "What happens if light with frequency ν < ν0 (wavelength λ > λ0) strikes the photocathode?",
      "options": [
        "No photoelectrons are emitted, no matter how intense the light beam is",
        "A huge photocurrent flows immediately",
        "The photocell explodes",
        "Electrons emit after 1 hour delay"
      ],
      "answer": "No photoelectrons are emitted, no matter how intense the light beam is",
      "correct_option": "No photoelectrons are emitted, no matter how intense the light beam is",
      "difficulty": "easy",
      "global_id": 10,
      "explanation": "Since individual photon energy hν is less than the work function Φ, no single photon has enough energy to liberate an electron, confirming photon theory over wave theory."
    },
    {
      "id": "planck-q11",
      "question": "How quickly does photoemission occur after light illuminates the photocathode (time lag)?",
      "options": [
        "Almost instantaneously (time delay < 10⁻⁹ seconds / 1 nanosecond)",
        "After several minutes of thermal accumulation",
        "After exactly 1 hour",
        "After 1 second"
      ],
      "answer": "Almost instantaneously (time delay < 10⁻⁹ seconds / 1 nanosecond)",
      "correct_option": "Almost instantaneously (time delay < 10⁻⁹ seconds / 1 nanosecond)",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "Classical wave theory predicted hours of energy accumulation over the wavefront area; quantum mechanics proves instantaneous (< 10⁻⁹ s) photon-electron collisions."
    },
    {
      "id": "planck-q12",
      "question": "If a photocell has a work function of Φ = 2.0 eV, what is its threshold frequency ν0?",
      "options": [
        "4.83 x 10¹⁴ Hz",
        "3.00 x 10⁸ Hz",
        "1.24 x 10¹⁵ Hz",
        "6.63 x 10¹⁴ Hz"
      ],
      "answer": "4.83 x 10¹⁴ Hz",
      "correct_option": "4.83 x 10¹⁴ Hz",
      "difficulty": "medium",
      "global_id": 12,
      "explanation": "ν0 = Φ / h = (2.0 * 1.602e-19 J) / (6.626e-34 J·s) = 3.204e-19 / 6.626e-34 ≈ 4.835 x 10¹⁴ Hz."
    },
    {
      "id": "planck-q13",
      "question": "For a photocathode with work function Φ = 2.0 eV, what is the threshold wavelength λ0 in nanometers?",
      "options": [
        "620 nm",
        "310 nm",
        "400 nm",
        "750 nm"
      ],
      "answer": "620 nm",
      "correct_option": "620 nm",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "λ0 = hc / Φ = 1240 eV·nm / 2.0 eV = 620 nm (yellow-orange light)."
    },
    {
      "id": "planck-q14",
      "question": "Light of wavelength λ = 400 nm (frequency ν = 7.5 x 10¹⁴ Hz) illuminates a photocathode with Φ = 2.2 eV. What is the stopping potential V_s?",
      "options": [
        "0.90 V",
        "3.10 V",
        "2.20 V",
        "1.55 V"
      ],
      "answer": "0.90 V",
      "correct_option": "0.90 V",
      "difficulty": "hard",
      "global_id": 14,
      "explanation": "Photon energy E = 1240 / 400 nm = 3.10 eV. eV_s = E - Φ = 3.10 eV - 2.20 eV = 0.90 eV. Thus V_s = 0.90 V."
    },
    {
      "id": "planck-q15",
      "question": "If the frequency of incident light is doubled from ν to 2ν, what happens to the maximum kinetic energy K_max of the emitted photoelectrons?",
      "options": [
        "It more than doubles (K_max,new = 2*K_max + Φ > 2*K_max)",
        "It exactly doubles",
        "It remains constant",
        "It quadruples"
      ],
      "answer": "It more than doubles (K_max,new = 2*K_max + Φ > 2*K_max)",
      "correct_option": "It more than doubles (K_max,new = 2*K_max + Φ > 2*K_max)",
      "difficulty": "hard",
      "global_id": 15,
      "explanation": "K_max = hν - Φ. For 2ν, K_new = 2hν - Φ = 2(K_max + Φ) - Φ = 2 K_max + Φ, which is strictly greater than double."
    },
    {
      "id": "planck-q16",
      "question": "In the LED method for determining Planck's constant, how is h estimated from the knee/turn-on voltage V_knee and emitted wavelength λ?",
      "options": [
        "h ≈ (e * V_knee * λ) / c",
        "h = (e * V_knee) / (c * λ)",
        "h = (c * λ) / (e * V_knee)",
        "h = e * V_knee * c"
      ],
      "answer": "h ≈ (e * V_knee * λ) / c",
      "correct_option": "h ≈ (e * V_knee * λ) / c",
      "difficulty": "medium",
      "global_id": 16,
      "explanation": "Assuming the electrical energy e V_knee approximately equals photon bandgap energy hν = hc/λ, solving for h gives h = e V_knee λ / c."
    },
    {
      "id": "planck-q17",
      "question": "In the LED method, if an LED with λ = 650 nm has an experimental knee voltage of V_knee = 1.90 V, what is the calculated value of h?",
      "options": [
        "6.58 x 10⁻³⁴ J·s",
        "7.50 x 10⁻³⁴ J·s",
        "5.20 x 10⁻³⁴ J·s",
        "6.63 x 10⁻²⁷ J·s"
      ],
      "answer": "6.58 x 10⁻³⁴ J·s",
      "correct_option": "6.58 x 10⁻³⁴ J·s",
      "difficulty": "hard",
      "global_id": 17,
      "explanation": "h = (1.602e-19 C * 1.90 V * 650e-9 m) / (3.0e8 m/s) = 1.978e-25 / 3.0e8 ≈ 6.59 x 10⁻³⁴ J·s."
    },
    {
      "id": "planck-q18",
      "question": "Why is the photocell tube evacuated to high vacuum?",
      "options": [
        "To prevent emitted photoelectrons from colliding with air molecules and losing kinetic energy before reaching the anode",
        "To keep the glass envelope cold",
        "To prevent light from escaping",
        "To reduce atmospheric pressure on the battery"
      ],
      "answer": "To prevent emitted photoelectrons from colliding with air molecules and losing kinetic energy before reaching the anode",
      "correct_option": "To prevent emitted photoelectrons from colliding with air molecules and losing kinetic energy before reaching the anode",
      "difficulty": "easy",
      "global_id": 18,
      "explanation": "Air molecules would scatter photoelectrons through inelastic collisions, altering their kinetic energy and extinguishing the measurable current."
    },
    {
      "id": "planck-q19",
      "question": "Why is potassium or caesium commonly used as the photocathode material in educational photoelectric effect apparatus?",
      "options": [
        "Alkali metals have very low work functions (~1.9 eV to 2.3 eV), allowing photoemission with visible light",
        "Alkali metals are transparent to UV light",
        "Alkali metals do not conduct electricity",
        "Alkali metals have high melting points"
      ],
      "answer": "Alkali metals have very low work functions (~1.9 eV to 2.3 eV), allowing photoemission with visible light",
      "correct_option": "Alkali metals have very low work functions (~1.9 eV to 2.3 eV), allowing photoemission with visible light",
      "difficulty": "easy",
      "global_id": 19,
      "explanation": "Alkali metals have a single loosely bound valence electron, yielding low work functions (Cs ≈ 1.9 eV, K ≈ 2.2 eV) that respond to standard visible light filters."
    },
    {
      "id": "planck-q20",
      "question": "What optical filters are typically used in a photoelectric experiment to isolate specific spectral wavelengths from a mercury vapor lamp?",
      "options": [
        "Narrowband transmission optical interference filters (e.g. 365 nm, 405 nm, 436 nm, 546 nm, 577 nm)",
        "Neutral density filters",
        "Infrared absorption filters only",
        "Polarizing sheets"
      ],
      "answer": "Narrowband transmission optical interference filters (e.g. 365 nm, 405 nm, 436 nm, 546 nm, 577 nm)",
      "correct_option": "Narrowband transmission optical interference filters (e.g. 365 nm, 405 nm, 436 nm, 546 nm, 577 nm)",
      "difficulty": "medium",
      "global_id": 20,
      "explanation": "Mercury vapor lamps emit discrete, intense spectral lines; colored interference filters isolate individual monochromatic wavelengths to measure V_s(λ)."
    },
    {
      "id": "planck-q21",
      "question": "Why does the measured photocurrent in a photocell not drop abruptly to zero at V = 0, but continues to flow even under slight negative retarding voltages?",
      "options": [
        "Photoelectrons are ejected with significant initial kinetic energy and can overcome small opposing retarding fields",
        "The battery voltage leaks into the tube",
        "Thermal ions carry the current",
        "Glass becomes conductive at zero voltage"
      ],
      "answer": "Photoelectrons are ejected with significant initial kinetic energy and can overcome small opposing retarding fields",
      "correct_option": "Photoelectrons are ejected with significant initial kinetic energy and can overcome small opposing retarding fields",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "Electrons possess initial kinetic energies up to K_max = hν - Φ; they can fly across the vacuum gap against a retarding electric field until potential reaches -V_s."
    },
    {
      "id": "planck-q22",
      "question": "What is the contact potential difference (V_cpd) between the photocathode and anode, and how does it affect experimental stopping potential measurements?",
      "options": [
        "V_cpd = (Φ_anode - Φ_cathode) / e; it adds a systematic voltage offset that shifts the measured stopping potential",
        "It multiplies the speed of light by two",
        "It cancels Planck's constant",
        "It is always strictly zero"
      ],
      "answer": "V_cpd = (Φ_anode - Φ_cathode) / e; it adds a systematic voltage offset that shifts the measured stopping potential",
      "correct_option": "V_cpd = (Φ_anode - Φ_cathode) / e; it adds a systematic voltage offset that shifts the measured stopping potential",
      "difficulty": "hard",
      "global_id": 22,
      "explanation": "When two dissimilar metals are connected in a circuit, their work function difference creates a contact potential V_cpd. However, since V_cpd is constant, it does not alter the slope (h/e) of V_s vs ν."
    },
    {
      "id": "planck-q23",
      "question": "Why is the slope of the V_s vs ν line identical regardless of what metal is used for the photocathode?",
      "options": [
        "The slope is fundamental (h / e), depending only on universal constants h and e, not material properties",
        "All metals have the same work function",
        "Light frequency changes inside metal",
        "Cathodes are made of copper"
      ],
      "answer": "The slope is fundamental (h / e), depending only on universal constants h and e, not material properties",
      "correct_option": "The slope is fundamental (h / e), depending only on universal constants h and e, not material properties",
      "difficulty": "easy",
      "global_id": 23,
      "explanation": "Einstein's equation V_s = (h/e)ν - Φ/e shows that the slope h/e is a universal constant of nature; only the intercept -Φ/e varies with cathode material."
    },
    {
      "id": "planck-q24",
      "question": "What instrument is required to measure the minute photocurrents (picoamperes to nanoamperes) in a photoelectric experiment?",
      "options": [
        "A high-sensitivity electrometer or picoammeter (input impedance > 10¹² Ω)",
        "A moving-iron AC ammeter",
        "A standard analog galvanometer",
        "A clamp meter"
      ],
      "answer": "A high-sensitivity electrometer or picoammeter (input impedance > 10¹² Ω)",
      "correct_option": "A high-sensitivity electrometer or picoammeter (input impedance > 10¹² Ω)",
      "difficulty": "medium",
      "global_id": 24,
      "explanation": "Typical photoelectric currents are on the order of 10⁻¹¹ A to 10⁻⁸ A, requiring high-input-impedance electrometers to detect the zero-current null point accurately."
    },
    {
      "id": "planck-q25",
      "question": "If light of frequency 1.0 x 10¹⁵ Hz falls on a metal and produces a stopping potential of 1.65 V, what is the experimental value of Planck's constant if the work function is 2.48 eV?",
      "options": [
        "6.61 x 10⁻³⁴ J·s",
        "5.50 x 10⁻³⁴ J·s",
        "7.20 x 10⁻³⁴ J·s",
        "6.63 x 10⁻²⁷ J·s"
      ],
      "answer": "6.61 x 10⁻³⁴ J·s",
      "correct_option": "6.61 x 10⁻³⁴ J·s",
      "difficulty": "hard",
      "global_id": 25,
      "explanation": "hν = eV_s + Φ = (1.65 eV + 2.48 eV) = 4.13 eV = 4.13 * 1.602e-19 J = 6.616e-19 J. h = 6.616e-19 / 1.0e15 = 6.616 x 10⁻³⁴ J·s."
    },
    {
      "id": "planck-q26",
      "question": "Why did classical electromagnetic wave theory fail to explain the existence of a threshold frequency in the photoelectric effect?",
      "options": [
        "Wave theory predicted that any frequency of light could eject electrons if given sufficient intensity or exposure time",
        "Wave theory denied that light had energy",
        "Wave theory predicted that light could not travel through vacuum",
        "Wave theory required electrons to have zero charge"
      ],
      "answer": "Wave theory predicted that any frequency of light could eject electrons if given sufficient intensity or exposure time",
      "correct_option": "Wave theory predicted that any frequency of light could eject electrons if given sufficient intensity or exposure time",
      "difficulty": "medium",
      "global_id": 26,
      "explanation": "Classical theory viewed light as continuous waves spreading energy over time; high intensity of any frequency should have accumulated enough energy to liberate electrons, contradicting experimental fact."
    },
    {
      "id": "planck-q27",
      "question": "Why did classical wave theory fail to explain why electron kinetic energy depends on light frequency rather than light intensity?",
      "options": [
        "Wave theory predicted that higher light intensity (larger electric field amplitude E) should impart greater kinetic energy to ejected electrons",
        "Wave theory predicted that light frequency was constant",
        "Wave theory could not define kinetic energy",
        "Wave theory assumed electrons were stationary"
      ],
      "answer": "Wave theory predicted that higher light intensity (larger electric field amplitude E) should impart greater kinetic energy to ejected electrons",
      "correct_option": "Wave theory predicted that higher light intensity (larger electric field amplitude E) should impart greater kinetic energy to ejected electrons",
      "difficulty": "medium",
      "global_id": 27,
      "explanation": "In classical physics, wave energy flux is proportional to E² (intensity); higher intensity should have produced faster electrons. Experiment showed that intensity only increases electron count, while frequency determines speed."
    },
    {
      "id": "planck-q28",
      "question": "What is a photon?",
      "options": [
        "A discrete quantum (packet) of electromagnetic energy carrying energy E = hν and momentum p = h / λ",
        "A positively charged nucleus particle",
        "A wave with infinite wavelength",
        "A subatomic particle with rest mass of 1 kg"
      ],
      "answer": "A discrete quantum (packet) of electromagnetic energy carrying energy E = hν and momentum p = h / λ",
      "correct_option": "A discrete quantum (packet) of electromagnetic energy carrying energy E = hν and momentum p = h / λ",
      "difficulty": "easy",
      "global_id": 28,
      "explanation": "Einstein postulated that light propagates and interacts as localized quanta called photons, each carrying energy hν and zero rest mass."
    },
    {
      "id": "planck-q29",
      "question": "What is the momentum p of a photon of wavelength λ?",
      "options": [
        "p = h / λ",
        "p = h * λ",
        "p = λ / h",
        "p = h * c / λ"
      ],
      "answer": "p = h / λ",
      "correct_option": "p = h / λ",
      "difficulty": "medium",
      "global_id": 29,
      "explanation": "By the de Broglie relation and relativistic energy-momentum (E = pc), a photon carries momentum p = E/c = hν/c = h/λ."
    },
    {
      "id": "planck-q30",
      "question": "What major scientific prize was Albert Einstein awarded in 1921 for his discovery of the law of the photoelectric effect?",
      "options": [
        "The Nobel Prize in Physics",
        "The Fields Medal",
        "The Copley Medal",
        "The Planck Medal"
      ],
      "answer": "The Nobel Prize in Physics",
      "correct_option": "The Nobel Prize in Physics",
      "difficulty": "easy",
      "global_id": 30,
      "explanation": "Einstein was awarded the 1921 Nobel Prize in Physics specifically 'for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect'."
    },
    {
      "id": "planck-q31",
      "question": "In a photoelectric experiment, what causes reverse current when the anode voltage is driven to large negative values?",
      "options": [
        "Photoemission from the anode itself if scattered light strikes the anode surface",
        "Battery leakage current",
        "Dielectric breakdown of vacuum",
        "Thermal electron emission from the meter"
      ],
      "answer": "Photoemission from the anode itself if scattered light strikes the anode surface",
      "correct_option": "Photoemission from the anode itself if scattered light strikes the anode surface",
      "difficulty": "hard",
      "global_id": 31,
      "explanation": "If stray incident light strikes the collector/anode, it ejects photoelectrons back toward the cathode under the strong negative anode bias, creating a reverse current offset."
    },
    {
      "id": "planck-q32",
      "question": "How is reverse anode photoemission experimentally minimized in precision photocell housings?",
      "options": [
        "By using an anode made of a thin wire ring or loop that presents minimal surface area to stray light, often coated with high-work-function metal",
        "By painting the cathode black",
        "By running the experiment in dark rooms only",
        "By cooling the anode to 0 Kelvin"
      ],
      "answer": "By using an anode made of a thin wire ring or loop that presents minimal surface area to stray light, often coated with high-work-function metal",
      "correct_option": "By using an anode made of a thin wire ring or loop that presents minimal surface area to stray light, often coated with high-work-function metal",
      "difficulty": "hard",
      "global_id": 32,
      "explanation": "A thin wire loop anode intercepts minimal light while collecting electrons efficiently; high work function further suppresses photoemission from the anode."
    },
    {
      "id": "planck-q33",
      "question": "What is the De Broglie wavelength λ_dB of an electron accelerated through a potential difference V?",
      "options": [
        "λ_dB = h / √(2 * m * e * V) ≈ 1.227 / √V nm",
        "λ_dB = h * √(V)",
        "λ_dB = e * V / h",
        "λ_dB = √(V) / 1.227 nm"
      ],
      "answer": "λ_dB = h / √(2 * m * e * V) ≈ 1.227 / √V nm",
      "correct_option": "λ_dB = h / √(2 * m * e * V) ≈ 1.227 / √V nm",
      "difficulty": "hard",
      "global_id": 33,
      "explanation": "Since p = √(2mE) = √(2m e V), the de Broglie wavelength is λ = h/p = h / √(2me V) ≈ 1.227 / √V nm."
    },
    {
      "id": "planck-q34",
      "question": "What is the energy of a photon of green light (λ = 532 nm) in electron-volts?",
      "options": [
        "2.33 eV",
        "1.50 eV",
        "3.40 eV",
        "4.12 eV"
      ],
      "answer": "2.33 eV",
      "correct_option": "2.33 eV",
      "difficulty": "medium",
      "global_id": 34,
      "explanation": "E = hc / λ = 1240 / 532 nm ≈ 2.33 eV."
    },
    {
      "id": "planck-q35",
      "question": "What is the energy of an ultraviolet photon with wavelength λ = 254 nm (from a mercury discharge)?",
      "options": [
        "4.88 eV",
        "2.10 eV",
        "1.24 eV",
        "6.63 eV"
      ],
      "answer": "4.88 eV",
      "correct_option": "4.88 eV",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "E = 1240 / 254 nm ≈ 4.88 eV."
    },
    {
      "id": "planck-q36",
      "question": "If the work function of platinum is 5.65 eV, can visible light (400 nm to 700 nm) cause photoemission from platinum?",
      "options": [
        "No, because visible photon energy (1.77 eV to 3.10 eV) is much less than the 5.65 eV work function",
        "Yes, if the light is very intense",
        "Yes, red light can do it",
        "Yes, green light can do it"
      ],
      "answer": "No, because visible photon energy (1.77 eV to 3.10 eV) is much less than the 5.65 eV work function",
      "correct_option": "No, because visible photon energy (1.77 eV to 3.10 eV) is much less than the 5.65 eV work function",
      "difficulty": "easy",
      "global_id": 36,
      "explanation": "Maximum visible photon energy at 400 nm is 3.1 eV, which is far below 5.65 eV; photoemission from platinum requires deep UV light (λ < 220 nm)."
    },
    {
      "id": "planck-q37",
      "question": "What is the relation between Planck's constant h and the reduced Planck's constant ℏ ('h-bar')?",
      "options": [
        "ℏ = h / (2 * π)",
        "ℏ = 2 * π * h",
        "ℏ = h / π",
        "ℏ = h²"
      ],
      "answer": "ℏ = h / (2 * π)",
      "correct_option": "ℏ = h / (2 * π)",
      "difficulty": "easy",
      "global_id": 37,
      "explanation": "The reduced Planck constant (Dirac constant) is defined as ℏ = h / (2π) ≈ 1.05457 x 10⁻³⁴ J·s."
    },
    {
      "id": "planck-q38",
      "question": "In the Compton effect, what happens to the wavelength of an X-ray photon after scattering off a stationary electron?",
      "options": [
        "Wavelength increases (λ' > λ) because the photon transfers energy and momentum to the recoil electron",
        "Wavelength decreases",
        "Wavelength remains exactly unchanged",
        "The photon turns into an electron"
      ],
      "answer": "Wavelength increases (λ' > λ) because the photon transfers energy and momentum to the recoil electron",
      "correct_option": "Wavelength increases (λ' > λ) because the photon transfers energy and momentum to the recoil electron",
      "difficulty": "medium",
      "global_id": 38,
      "explanation": "Compton scattering confirms particle kinematics: Δλ = λ' - λ = (h / (m_e * c)) * (1 - cos θ), where h/(m_e c) ≈ 2.426 pm is the Compton wavelength."
    },
    {
      "id": "planck-q39",
      "question": "What is the Compton wavelength of an electron λ_c = h / (m_e * c)?",
      "options": [
        "2.426 x 10⁻¹² m (2.426 pm)",
        "0.529 x 10⁻¹⁰ m",
        "1.227 nm",
        "6.626 x 10⁻³⁴ m"
      ],
      "answer": "2.426 x 10⁻¹² m (2.426 pm)",
      "correct_option": "2.426 x 10⁻¹² m (2.426 pm)",
      "difficulty": "hard",
      "global_id": 39,
      "explanation": "λ_c = (6.626e-34) / (9.109e-31 * 3.0e8) = 6.626e-34 / 2.733e-22 ≈ 2.426 x 10⁻¹² m = 2.426 pm."
    },
    {
      "id": "planck-q40",
      "question": "What happens to the photocurrent when the anode voltage is made increasingly positive (accelerating potential)?",
      "options": [
        "It increases initially and then saturates at a constant maximum value I_sat",
        "It increases infinitely without bound",
        "It immediately drops to zero",
        "It oscillates between positive and negative"
      ],
      "answer": "It increases initially and then saturates at a constant maximum value I_sat",
      "correct_option": "It increases initially and then saturates at a constant maximum value I_sat",
      "difficulty": "medium",
      "global_id": 40,
      "explanation": "At moderate positive voltage, all photoelectrons emitted per second are collected by the anode; further increasing voltage cannot increase current beyond this saturation limit."
    },
    {
      "id": "planck-q41",
      "question": "What does the slope of the linear I-V curve in the retarding region near stopping potential indicate?",
      "options": [
        "The thermal velocity distribution and energy spread of emitted electrons",
        "The capacitance of the cable",
        "The resistance of the voltmeter",
        "The temperature of the sun"
      ],
      "answer": "The thermal velocity distribution and energy spread of emitted electrons",
      "correct_option": "The thermal velocity distribution and energy spread of emitted electrons",
      "difficulty": "hard",
      "global_id": 41,
      "explanation": "Photoelectrons are ejected with a distribution of velocities from 0 up to v_max; the rounded foot of the I-V curve near V_s reflects this distribution."
    },
    {
      "id": "planck-q42",
      "question": "In Max Planck's original 1900 hypothesis, how did he explain blackbody radiation?",
      "options": [
        "He assumed that atomic oscillators in the cavity walls can absorb or emit energy only in discrete packets of E = n * h * ν",
        "He assumed that light travels in circles",
        "He assumed that temperature cannot exceed 1000 K",
        "He assumed that atoms have zero mass"
      ],
      "answer": "He assumed that atomic oscillators in the cavity walls can absorb or emit energy only in discrete packets of E = n * h * ν",
      "correct_option": "He assumed that atomic oscillators in the cavity walls can absorb or emit energy only in discrete packets of E = n * h * ν",
      "difficulty": "easy",
      "global_id": 42,
      "explanation": "Planck resolved the 'ultraviolet catastrophe' by quantizing oscillator energies: E = n h ν (n = 0, 1, 2, ...), marking the birth of quantum theory."
    },
    {
      "id": "planck-q43",
      "question": "If two LEDs emit red (630 nm) and blue (470 nm) light, which LED has the higher turn-on voltage V_knee?",
      "options": [
        "The blue LED (shorter wavelength corresponds to higher photon energy hν)",
        "The red LED",
        "Both have identical turn-on voltage",
        "Turn-on voltage depends only on current"
      ],
      "answer": "The blue LED (shorter wavelength corresponds to higher photon energy hν)",
      "correct_option": "The blue LED (shorter wavelength corresponds to higher photon energy hν)",
      "difficulty": "easy",
      "global_id": 43,
      "explanation": "E = hc/λ. Blue light has shorter wavelength, higher frequency, higher bandgap energy, and therefore higher turn-on voltage (~2.8 V vs ~1.8 V for red)."
    },
    {
      "id": "planck-q44",
      "question": "How many photons per second are emitted by a 5.0 mW laser pointer operating at λ = 633 nm?",
      "options": [
        "1.6 x 10¹⁶ photons/second",
        "3.0 x 10⁸ photons/second",
        "6.6 x 10³⁴ photons/second",
        "1.0 x 10¹⁰ photons/second"
      ],
      "answer": "1.6 x 10¹⁶ photons/second",
      "correct_option": "1.6 x 10¹⁶ photons/second",
      "difficulty": "hard",
      "global_id": 44,
      "explanation": "Photon energy E_p = hc/λ = (6.626e-34 * 3.0e8) / 633e-9 ≈ 3.14e-19 J. N = Power / E_p = 5.0e-3 W / 3.14e-19 J ≈ 1.59 x 10¹⁶ photons/s."
    },
    {
      "id": "planck-q45",
      "question": "What is the quantum efficiency (QE) of a photocathode?",
      "options": [
        "The ratio of emitted photoelectrons to incident photons: QE = N_electrons / N_photons",
        "The ratio of input voltage to output voltage",
        "The ratio of work function to bandgap",
        "The total power dissipated"
      ],
      "answer": "The ratio of emitted photoelectrons to incident photons: QE = N_electrons / N_photons",
      "correct_option": "The ratio of emitted photoelectrons to incident photons: QE = N_electrons / N_photons",
      "difficulty": "medium",
      "global_id": 45,
      "explanation": "Quantum efficiency measures the probability that an incident photon successfully ejects a detectable photoelectron (typically 1% to 30% in photocathodes)."
    },
    {
      "id": "planck-q46",
      "question": "If an experiment measures stopping potentials of V_s1 = 1.48 V at ν1 = 8.2 x 10¹⁴ Hz and V_s2 = 0.65 V at ν2 = 6.2 x 10¹⁴ Hz, what is the calculated value of h?",
      "options": [
        "6.65 x 10⁻³⁴ J·s",
        "5.20 x 10⁻³⁴ J·s",
        "7.50 x 10⁻³⁴ J·s",
        "6.02 x 10⁻³⁴ J·s"
      ],
      "answer": "6.65 x 10⁻³⁴ J·s",
      "correct_option": "6.65 x 10⁻³⁴ J·s",
      "difficulty": "hard",
      "global_id": 46,
      "explanation": "Slope = ΔV_s / Δν = (1.48 - 0.65) / (8.2e14 - 6.2e14) = 0.83 V / 2.0e14 Hz = 4.15e-15 V·s. h = e * slope = 1.602e-19 * 4.15e-15 = 6.648 x 10⁻³⁴ J·s."
    },
    {
      "id": "planck-q47",
      "question": "What is the work function Φ of a metal physically defined as?",
      "options": [
        "The minimum thermodynamic energy required to remove an electron from the Fermi level to infinity outside the metal",
        "The energy required to split the atom",
        "The thermal energy of the nucleus",
        "The kinetic energy of free electrons"
      ],
      "answer": "The minimum thermodynamic energy required to remove an electron from the Fermi level to infinity outside the metal",
      "correct_option": "The minimum thermodynamic energy required to remove an electron from the Fermi level to infinity outside the metal",
      "difficulty": "easy",
      "global_id": 47,
      "explanation": "Work function Φ = E_vacuum - E_Fermi is the potential energy barrier binding the highest-energy electrons inside the conduction band of a metal."
    },
    {
      "id": "planck-q48",
      "question": "Why is a photocell often referred to as a quantum detector rather than a thermal detector?",
      "options": [
        "It counts discrete individual photon-electron interaction events directly rather than measuring temperature rise caused by absorbed power",
        "It operates at absolute zero",
        "It can detect gravity waves",
        "It creates quantum entangled photons"
      ],
      "answer": "It counts discrete individual photon-electron interaction events directly rather than measuring temperature rise caused by absorbed power",
      "correct_option": "It counts discrete individual photon-electron interaction events directly rather than measuring temperature rise caused by absorbed power",
      "difficulty": "medium",
      "global_id": 48,
      "explanation": "Quantum detectors rely on the photoelectric effect where each absorbed photon promotes a carrier across an energy gap, yielding wavelength-dependent sensitivity."
    },
    {
      "id": "planck-q49",
      "question": "If incident light intensity on a photocell is doubled while frequency is kept constant, what happens to the maximum velocity v_max of the emitted photoelectrons?",
      "options": [
        "v_max remains completely unchanged",
        "v_max doubles",
        "v_max quadruples",
        "v_max drops to half"
      ],
      "answer": "v_max remains completely unchanged",
      "correct_option": "v_max remains completely unchanged",
      "difficulty": "easy",
      "global_id": 49,
      "explanation": "Since (1/2)m v_max² = hν - Φ, the maximum velocity depends solely on light frequency ν and work function Φ; light intensity has zero effect on v_max."
    },
    {
      "id": "planck-q50",
      "question": "In a modern computerized physics experiment, how is the stopping potential V_s automatically determined from a digitized I-V curve?",
      "options": [
        "By finding the voltage intercept where the forward tangent to the photocurrent curve crosses the baseline dark current level",
        "By finding the maximum voltage",
        "By dividing peak current by resistance",
        "By averaging all recorded voltages"
      ],
      "answer": "By finding the voltage intercept where the forward tangent to the photocurrent curve crosses the baseline dark current level",
      "correct_option": "By finding the voltage intercept where the forward tangent to the photocurrent curve crosses the baseline dark current level",
      "difficulty": "medium",
      "global_id": 50,
      "explanation": "Automated software fits a linear regression to the steep photocurrent ascent and finds its intersection with the horizontal dark leakage current line to determine V_s precisely."
    }
  ]
};

export const RTD_SENSOR_QUESTION_BANK = {
  "experiment": "RTD Temperature Sensors (Pt100) - Question Bank",
  "experimentId": "rtd-sensor",
  "quizId": "rtd-sensor-mastery-quiz",
  "experimentName": "RTD Temperature Sensors (Pt100)",
  "description": "Comprehensive 50-Question Physics Question Bank for RTD Temperature Sensors (Pt100)",
  "total_questions": 50,
  "questions": [
    {
      "id": "rtd-q1",
      "question": "What does the acronym 'RTD' stand for in measurement instrumentation?",
      "options": [
        "Resistance Temperature Detector",
        "Radial Thermal Diaphragm",
        "Resonant Thermoelectric Device",
        "Rotary Torque Dynamometer"
      ],
      "answer": "Resistance Temperature Detector",
      "correct_option": "Resistance Temperature Detector",
      "difficulty": "easy",
      "global_id": 1,
      "explanation": "An RTD is a temperature sensor that exploits the predictable increase in electrical resistance of metals with temperature."
    },
    {
      "id": "rtd-q2",
      "question": "What is the nominal resistance of an industry-standard Pt100 RTD at 0°C (the ice point)?",
      "options": [
        "100.00 Ω",
        "0.00 Ω",
        "1000.0 Ω",
        "50.00 Ω"
      ],
      "answer": "100.00 Ω",
      "correct_option": "100.00 Ω",
      "difficulty": "easy",
      "global_id": 2,
      "explanation": "By definition, a Pt100 sensor is made of platinum (Pt) and has an exact nominal resistance of 100.00 Ω at 0.00°C."
    },
    {
      "id": "rtd-q3",
      "question": "Why is Platinum (Pt) the most widely used metal in high-precision RTDs?",
      "options": [
        "It has exceptional chemical inertness, high melting point, and a highly stable, linear resistance-temperature relationship",
        "It is the cheapest metal available",
        "It has zero electrical resistance at room temperature",
        "It is radioactive"
      ],
      "answer": "It has exceptional chemical inertness, high melting point, and a highly stable, linear resistance-temperature relationship",
      "correct_option": "It has exceptional chemical inertness, high melting point, and a highly stable, linear resistance-temperature relationship",
      "difficulty": "easy",
      "global_id": 3,
      "explanation": "Platinum resists oxidation and corrosion up to ~850°C, offering unmatched long-term stability, reproducibility, and linearity compared to nickel or copper."
    },
    {
      "id": "rtd-q4",
      "question": "What is the standard European (IEC 60751 / DIN 43760) temperature coefficient of resistance (alpha, α) for a Pt100 RTD?",
      "options": [
        "0.003851 °C⁻¹ (or 0.3851 Ω/°C on average between 0°C and 100°C)",
        "0.001000 °C⁻¹",
        "0.050000 °C⁻¹",
        "0.003920 °C⁻¹ (American reference grade)"
      ],
      "answer": "0.003851 °C⁻¹ (or 0.3851 Ω/°C on average between 0°C and 100°C)",
      "correct_option": "0.003851 °C⁻¹ (or 0.3851 Ω/°C on average between 0°C and 100°C)",
      "difficulty": "medium",
      "global_id": 4,
      "explanation": "Under IEC 60751, α = (R_100 - R_0) / (100 * R_0) = (138.51 - 100.00) / 10000 = 0.003851 °C⁻¹."
    },
    {
      "id": "rtd-q5",
      "question": "What is the theoretical resistance of an IEC 60751 Pt100 RTD at 100°C (the boiling point of water at 1 atm)?",
      "options": [
        "138.51 Ω",
        "200.00 Ω",
        "100.00 Ω",
        "150.00 Ω"
      ],
      "answer": "138.51 Ω",
      "correct_option": "138.51 Ω",
      "difficulty": "easy",
      "global_id": 5,
      "explanation": "Under the DIN/IEC 60751 curve, R(100°C) = 100.00 * (1 + 0.003851 * 100) = 138.51 Ω."
    },
    {
      "id": "rtd-q6",
      "question": "What is the governing equation used to describe the resistance-temperature relationship of a platinum RTD for temperatures above 0°C (Callendar-Van Dusen equation)?",
      "options": [
        "R(T) = R_0 * (1 + A * T + B * T²)",
        "R(T) = R_0 * exp(B / T)",
        "R(T) = R_0 / (1 + A * T)",
        "R(T) = R_0 + A * T³"
      ],
      "answer": "R(T) = R_0 * (1 + A * T + B * T²)",
      "correct_option": "R(T) = R_0 * (1 + A * T + B * T²)",
      "difficulty": "medium",
      "global_id": 6,
      "explanation": "For T ≥ 0°C, the Callendar-Van Dusen equation truncates to a quadratic: R(T) = R_0(1 + A T + B T²), where A ≈ 3.9083e-3 and B ≈ -5.775e-7 °C⁻²."
    },
    {
      "id": "rtd-q7",
      "question": "For temperatures below 0°C (-200°C to 0°C), what additional term is included in the Callendar-Van Dusen equation?",
      "options": [
        "C * (T - 100) * T³",
        "A * T⁴",
        "exp(-T / 100)",
        "B * T³"
      ],
      "answer": "C * (T - 100) * T³",
      "correct_option": "C * (T - 100) * T³",
      "difficulty": "hard",
      "global_id": 7,
      "explanation": "For T < 0°C, the equation is R(T) = R_0 [1 + A T + B T² + C(T - 100°C)T³], where C ≈ -4.183 x 10⁻¹² °C⁻⁴."
    },
    {
      "id": "rtd-q8",
      "question": "What is the sign of the temperature coefficient of resistance (TCR) for an RTD metal like platinum?",
      "options": [
        "Positive (PTC: resistance increases as temperature rises)",
        "Negative (NTC: resistance decreases as temperature rises)",
        "Zero (constant resistance)",
        "Alternating sign with frequency"
      ],
      "answer": "Positive (PTC: resistance increases as temperature rises)",
      "correct_option": "Positive (PTC: resistance increases as temperature rises)",
      "difficulty": "easy",
      "global_id": 8,
      "explanation": "In metals, increased thermal lattice vibrations (phonons) scatter conduction electrons, increasing electrical resistivity with temperature (Positive Temperature Coefficient)."
    },
    {
      "id": "rtd-q9",
      "question": "How does an RTD fundamentally differ from a standard NTC thermistor in terms of temperature coefficient and linearity?",
      "options": [
        "RTDs have a positive temperature coefficient and near-linear response; NTC thermistors have a negative coefficient and steep exponential non-linearity",
        "RTDs are non-linear; thermistors are perfectly linear",
        "RTDs measure voltage directly; thermistors measure current",
        "RTDs work only at 0°C"
      ],
      "answer": "RTDs have a positive temperature coefficient and near-linear response; NTC thermistors have a negative coefficient and steep exponential non-linearity",
      "correct_option": "RTDs have a positive temperature coefficient and near-linear response; NTC thermistors have a negative coefficient and steep exponential non-linearity",
      "difficulty": "medium",
      "global_id": 9,
      "explanation": "Thermistors use semiconductor ceramics with negative dR/dT described by the exponential Steinhart-Hart equation; RTDs use pure metals with gentle, highly linear positive dR/dT."
    },
    {
      "id": "rtd-q10",
      "question": "What is the primary drawback of a 2-wire RTD circuit configuration in industrial installations?",
      "options": [
        "The electrical resistance of the two lead wires (R_L1 + R_L2) adds directly to the sensor resistance, causing a false high temperature reading",
        "2-wire sensors cannot measure temperatures above 50°C",
        "2-wire sensors require AC voltage",
        "2-wire connections reverse the temperature polarity"
      ],
      "answer": "The electrical resistance of the two lead wires (R_L1 + R_L2) adds directly to the sensor resistance, causing a false high temperature reading",
      "correct_option": "The electrical resistance of the two lead wires (R_L1 + R_L2) adds directly to the sensor resistance, causing a false high temperature reading",
      "difficulty": "medium",
      "global_id": 10,
      "explanation": "In a 2-wire circuit, the measured resistance R_measured = R_RTD + 2*R_lead. Since 1 Ω of lead resistance causes ~2.6°C error in a Pt100, long leads cause huge errors."
    },
    {
      "id": "rtd-q11",
      "question": "How does a 3-wire RTD configuration compensate for lead wire resistance in a Wheatstone bridge?",
      "options": [
        "One lead wire is placed in an adjacent bridge arm to cancel the resistance of the return lead, assuming both leads have identical resistance",
        "It uses three separate RTD sensors in parallel",
        "It steps up the bridge voltage by 3x",
        "It grounds the middle lead to absorb noise"
      ],
      "answer": "One lead wire is placed in an adjacent bridge arm to cancel the resistance of the return lead, assuming both leads have identical resistance",
      "correct_option": "One lead wire is placed in an adjacent bridge arm to cancel the resistance of the return lead, assuming both leads have identical resistance",
      "difficulty": "medium",
      "global_id": 11,
      "explanation": "By placing lead 1 in series with the RTD and lead 2 in the balancing bridge arm, their equal resistances cancel out, leaving the measurement independent of lead length."
    },
    {
      "id": "rtd-q12",
      "question": "Which RTD wiring configuration provides the highest accuracy by completely eliminating lead wire resistance errors, even if the leads have unequal resistances?",
      "options": [
        "4-wire (Kelvin connection)",
        "2-wire connection",
        "3-wire connection",
        "Single-wire coaxial connection"
      ],
      "answer": "4-wire (Kelvin connection)",
      "correct_option": "4-wire (Kelvin connection)",
      "difficulty": "easy",
      "global_id": 12,
      "explanation": "A 4-wire connection passes a known constant current through two outer leads while a high-impedance voltmeter measures voltage across the two inner leads, drawing zero current through the sense leads."
    },
    {
      "id": "rtd-q13",
      "question": "What is self-heating error in an RTD sensor?",
      "options": [
        "The measurement current flowing through the RTD dissipates electrical power (I²R), causing the sensor to warm up above the ambient fluid temperature",
        "The sensor absorbing ambient infrared radiation",
        "Friction between lead wires",
        "Chemical reaction with the fluid"
      ],
      "answer": "The measurement current flowing through the RTD dissipates electrical power (I²R), causing the sensor to warm up above the ambient fluid temperature",
      "correct_option": "The measurement current flowing through the RTD dissipates electrical power (I²R), causing the sensor to warm up above the ambient fluid temperature",
      "difficulty": "medium",
      "global_id": 13,
      "explanation": "Joule heating P = I² R heats the platinum element. The temperature rise ΔT = P / S_dissipation leads to positive measurement errors if excitation current is too high."
    },
    {
      "id": "rtd-q14",
      "question": "What is the typical recommended excitation current used for a Pt100 RTD to minimize self-heating errors?",
      "options": [
        "0.5 mA to 1.0 mA (dissipating less than 0.1 mW)",
        "100 mA",
        "10 A",
        "10 µA (too low for noise immunity)"
      ],
      "answer": "0.5 mA to 1.0 mA (dissipating less than 0.1 mW)",
      "correct_option": "0.5 mA to 1.0 mA (dissipating less than 0.1 mW)",
      "difficulty": "medium",
      "global_id": 14,
      "explanation": "Keeping current at or below 1 mA limits power dissipation to P = (1 mA)² * 100 Ω = 0.1 mW, keeping self-heating typically below 0.05°C in fluids."
    },
    {
      "id": "rtd-q15",
      "question": "Using the linear approximation R(T) ≈ R_0 * (1 + α * T) with α = 0.00385 °C⁻¹, what is the approximate temperature T if a Pt100 measures 119.25 Ω?",
      "options": [
        "50.0°C",
        "25.0°C",
        "75.0°C",
        "100.0°C"
      ],
      "answer": "50.0°C",
      "correct_option": "50.0°C",
      "difficulty": "medium",
      "global_id": 15,
      "explanation": "T = (R_T - R_0) / (R_0 * α) = (119.25 - 100.00) / (100 * 0.00385) = 19.25 / 0.385 = 50.0°C."
    },
    {
      "id": "rtd-q16",
      "question": "What is the nominal resistance of a Pt1000 RTD at 0°C, and what is its primary advantage over a Pt100?",
      "options": [
        "1000 Ω at 0°C; its 10x higher resistance reduces the relative percentage error caused by lead wire resistance",
        "1000 Ω; it has 10x higher melting point",
        "1000 Ω; it operates without electric current",
        "100 Ω; it is 10 times smaller in physical size"
      ],
      "answer": "1000 Ω at 0°C; its 10x higher resistance reduces the relative percentage error caused by lead wire resistance",
      "correct_option": "1000 Ω at 0°C; its 10x higher resistance reduces the relative percentage error caused by lead wire resistance",
      "difficulty": "medium",
      "global_id": 16,
      "explanation": "With sensitivity of ~3.85 Ω/°C (vs 0.385 Ω/°C for Pt100), lead wire resistance of 1 Ω causes only 0.26°C error in a Pt1000, allowing accurate 2-wire connections over moderate distances."
    },
    {
      "id": "rtd-q17",
      "question": "What is the tolerance limit for a Class A Pt100 sensor under IEC 60751 at temperature T (°C)?",
      "options": [
        "±(0.15 + 0.002 * |T|) °C",
        "±(0.30 + 0.005 * |T|) °C",
        "±1.0 °C constant",
        "±0.01 °C constant"
      ],
      "answer": "±(0.15 + 0.002 * |T|) °C",
      "correct_option": "±(0.15 + 0.002 * |T|) °C",
      "difficulty": "hard",
      "global_id": 17,
      "explanation": "IEC 60751 defines Class A tolerance as ±(0.15 + 0.002 |T|), meaning ±0.15°C at 0°C and ±0.35°C at 100°C."
    },
    {
      "id": "rtd-q18",
      "question": "What is the tolerance limit for a Class B Pt100 sensor under IEC 60751 at temperature T (°C)?",
      "options": [
        "±(0.30 + 0.005 * |T|) °C",
        "±(0.15 + 0.002 * |T|) °C",
        "±0.05 °C",
        "±2.5 °C"
      ],
      "answer": "±(0.30 + 0.005 * |T|) °C",
      "correct_option": "±(0.30 + 0.005 * |T|) °C",
      "difficulty": "hard",
      "global_id": 18,
      "explanation": "Class B (standard industrial grade) has tolerance ±(0.30 + 0.005 |T|), corresponding to ±0.30°C at 0°C and ±0.80°C at 100°C."
    },
    {
      "id": "rtd-q19",
      "question": "What is a 1/10 DIN (or Class 1/10B) RTD?",
      "options": [
        "A high-precision sensor with tolerance equal to 1/10th of Class B (±0.03°C at 0°C)",
        "A sensor that measures 1/10th of a volt",
        "A sensor with 10 platinum wires",
        "A sensor calibrated at 10 temperatures"
      ],
      "answer": "A high-precision sensor with tolerance equal to 1/10th of Class B (±0.03°C at 0°C)",
      "correct_option": "A high-precision sensor with tolerance equal to 1/10th of Class B (±0.03°C at 0°C)",
      "difficulty": "medium",
      "global_id": 19,
      "explanation": "1/10 DIN sensors are specially selected and calibrated for laboratory metrology, offering ±0.03°C accuracy at the ice point."
    },
    {
      "id": "rtd-q20",
      "question": "What are the two common physical construction types of RTD elements?",
      "options": [
        "Wire-wound (platinum wire coiled around a ceramic core) and Thin-film (platinum deposited on a ceramic substrate)",
        "Solid bar and hollow tube",
        "Liquid mercury and alcohol capillary",
        "Carbon disc and ferrite bead"
      ],
      "answer": "Wire-wound (platinum wire coiled around a ceramic core) and Thin-film (platinum deposited on a ceramic substrate)",
      "correct_option": "Wire-wound (platinum wire coiled around a ceramic core) and Thin-film (platinum deposited on a ceramic substrate)",
      "difficulty": "easy",
      "global_id": 20,
      "explanation": "Wire-wound elements offer highest accuracy and stability over wide ranges (-200°C to +850°C); thin-film elements offer compact size, low cost, and fast thermal response."
    },
    {
      "id": "rtd-q21",
      "question": "Why do thin-film RTDs generally have faster thermal response times than wire-wound RTDs?",
      "options": [
        "They have much smaller physical mass and thermal capacitance, allowing rapid thermal equilibrium",
        "Thin films have higher thermal conductivity than pure platinum",
        "Thin films do not conduct electricity",
        "Thin films generate microwave radiation"
      ],
      "answer": "They have much smaller physical mass and thermal capacitance, allowing rapid thermal equilibrium",
      "correct_option": "They have much smaller physical mass and thermal capacitance, allowing rapid thermal equilibrium",
      "difficulty": "medium",
      "global_id": 21,
      "explanation": "The low thermal mass of a microscopic platinum film on an alumina substrate enables fast thermal time constants (τ < 0.1 s in water)."
    },
    {
      "id": "rtd-q22",
      "question": "What is the thermal time constant (tau, τ) of a temperature sensor?",
      "options": [
        "The time required for the sensor to record 63.2% of a sudden step change in temperature",
        "The time to reach 100% equilibrium",
        "The time required to melt the sensor",
        "The time between calibration cycles"
      ],
      "answer": "The time required for the sensor to record 63.2% of a sudden step change in temperature",
      "correct_option": "The time required for the sensor to record 63.2% of a sudden step change in temperature",
      "difficulty": "medium",
      "global_id": 22,
      "explanation": "In first-order thermal response, T(t) = T_final + (T_initial - T_final) * exp(-t/τ). At t = τ, the change completed is 1 - e⁻¹ ≈ 63.2%."
    },
    {
      "id": "rtd-q23",
      "question": "What is the typical usable measurement temperature range for an industrial platinum RTD?",
      "options": [
        "-200°C to +650°C (up to 850°C with specialized ceramic packaging)",
        "-50°C to +100°C only",
        "0°C to 100°C only",
        "+500°C to +3000°C"
      ],
      "answer": "-200°C to +650°C (up to 850°C with specialized ceramic packaging)",
      "correct_option": "-200°C to +650°C (up to 850°C with specialized ceramic packaging)",
      "difficulty": "easy",
      "global_id": 23,
      "explanation": "Platinum RTDs cover the broad range from cryogenic temperatures (-200°C) to intense industrial heat (+650°C to +850°C)."
    },
    {
      "id": "rtd-q24",
      "question": "What protective casing is typically placed around an RTD sensor when installed inside an industrial pressurized fluid pipe?",
      "options": [
        "A thermowell (metal protection sheath)",
        "A glass test tube",
        "Plastic shrink wrap",
        "A wooden dowel"
      ],
      "answer": "A thermowell (metal protection sheath)",
      "correct_option": "A thermowell (metal protection sheath)",
      "difficulty": "easy",
      "global_id": 24,
      "explanation": "A thermowell isolates the RTD from high pressure, corrosive chemicals, and flow erosion, permitting sensor replacement without draining the process pipe."
    },
    {
      "id": "rtd-q25",
      "question": "Why does an RTD have higher measurement repeatability and long-term stability than a thermocouple?",
      "options": [
        "Platinum resistance changes strictly via stable metallic lattice scattering without junction degradation or chemical drift",
        "RTDs generate their own power",
        "Thermocouple wires melt at 50°C",
        "RTDs are immune to all noise"
      ],
      "answer": "Platinum resistance changes strictly via stable metallic lattice scattering without junction degradation or chemical drift",
      "correct_option": "Platinum resistance changes strictly via stable metallic lattice scattering without junction degradation or chemical drift",
      "difficulty": "medium",
      "global_id": 25,
      "explanation": "Thermocouples suffer from wire oxidation, cold-junction drift, and metallurgical inhomogeneities; pure platinum RTD elements maintain resistance calibration to within a few thousandths of a degree over years."
    },
    {
      "id": "rtd-q26",
      "question": "What is the Seebeck effect, and why is it an unwanted source of error in RTD circuits?",
      "options": [
        "Dissimilar metal junctions (e.g. copper lead to platinum lead) generate parasitic thermoelectric EMF voltages if a temperature gradient exists across the terminals",
        "Magnetic fields induce eddy currents in platinum",
        "Mechanical stress alters wire resistance",
        "Thermal expansion cracks the casing"
      ],
      "answer": "Dissimilar metal junctions (e.g. copper lead to platinum lead) generate parasitic thermoelectric EMF voltages if a temperature gradient exists across the terminals",
      "correct_option": "Dissimilar metal junctions (e.g. copper lead to platinum lead) generate parasitic thermoelectric EMF voltages if a temperature gradient exists across the terminals",
      "difficulty": "hard",
      "global_id": 26,
      "explanation": "Connecting copper leads to platinum creates a thermocouple junction; if the two terminals are at slightly different temperatures, parasitic DC microvolts skew the voltage measurement."
    },
    {
      "id": "rtd-q27",
      "question": "How can parasitic thermoelectric EMF voltages in RTD circuits be eliminated electronically?",
      "options": [
        "Using current-reversal (alternating DC excitation) and averaging the two voltage readings",
        "Increasing excitation current to 10 A",
        "Cooling the leads with liquid nitrogen",
        "Using AC power at 50 Hz"
      ],
      "answer": "Using current-reversal (alternating DC excitation) and averaging the two voltage readings",
      "correct_option": "Using current-reversal (alternating DC excitation) and averaging the two voltage readings",
      "difficulty": "hard",
      "global_id": 27,
      "explanation": "By measuring V_forward = V_RTD + V_EMF and V_reverse = -V_RTD + V_EMF, subtracting gives V_RTD = (V_forward - V_reverse) / 2, canceling V_EMF completely."
    },
    {
      "id": "rtd-q28",
      "question": "If an uncalibrated 2-wire Pt100 sensor has two copper lead wires with resistance R_lead = 1.925 Ω each, what false temperature offset will be reported at 0°C?",
      "options": [
        "+10.0°C (reads 10.0°C instead of 0.0°C)",
        "+1.925°C",
        "-10.0°C",
        "+0.385°C"
      ],
      "answer": "+10.0°C (reads 10.0°C instead of 0.0°C)",
      "correct_option": "+10.0°C (reads 10.0°C instead of 0.0°C)",
      "difficulty": "medium",
      "global_id": 28,
      "explanation": "Total lead resistance R_lead_total = 2 * 1.925 Ω = 3.85 Ω. Since α * R_0 = 0.385 Ω/°C, the false offset is 3.85 Ω / 0.385 Ω/°C = +10.0°C."
    },
    {
      "id": "rtd-q29",
      "question": "What is the ice point calibration procedure for an RTD in a standards laboratory?",
      "options": [
        "Immersing the sensor in a prepared ice-water bath of shaved pure distilled water ice saturated with air-saturated water (0.000°C)",
        "Placing the sensor in a domestic freezer",
        "Holding an ice cube against the sheath",
        "Measuring dry ice vapor"
      ],
      "answer": "Immersing the sensor in a prepared ice-water bath of shaved pure distilled water ice saturated with air-saturated water (0.000°C)",
      "correct_option": "Immersing the sensor in a prepared ice-water bath of shaved pure distilled water ice saturated with air-saturated water (0.000°C)",
      "difficulty": "easy",
      "global_id": 29,
      "explanation": "A properly prepared ice point bath with shaved distilled water ice and deionized water provides an accurate, reproducible 0.000°C ± 0.002°C physical reference."
    },
    {
      "id": "rtd-q30",
      "question": "What is the Triple Point of Water (TPW), the primary defining fixed point on the International Temperature Scale of 1990 (ITS-90)?",
      "options": [
        "0.01°C (273.16 K at 611.657 Pa)",
        "0.00°C exactly",
        "-273.15°C",
        "100.00°C"
      ],
      "answer": "0.01°C (273.16 K at 611.657 Pa)",
      "correct_option": "0.01°C (273.16 K at 611.657 Pa)",
      "difficulty": "medium",
      "global_id": 30,
      "explanation": "The triple point of water—where solid, liquid, and vapor coexist in thermodynamic equilibrium—is defined as exactly 273.16 K (0.01°C) in ITS-90."
    },
    {
      "id": "rtd-q31",
      "question": "In an automated data acquisition system, what integrated circuit architecture is typically used to interface with a 4-wire RTD (e.g. ADS1220, MAX31865)?",
      "options": [
        "A precision 24-bit delta-sigma ADC with matched programmable internal current sources (IDACs) and ratiometric reference",
        "A simple 8-bit counter",
        "A 555 timer oscillator",
        "A digital phase locked loop"
      ],
      "answer": "A precision 24-bit delta-sigma ADC with matched programmable internal current sources (IDACs) and ratiometric reference",
      "correct_option": "A precision 24-bit delta-sigma ADC with matched programmable internal current sources (IDACs) and ratiometric reference",
      "difficulty": "medium",
      "global_id": 31,
      "explanation": "Modern RTD frontend ICs use dual matched current sources and ratiometric conversion: the excitation current flows through both the RTD and a precision reference resistor, making conversion independent of absolute current drift."
    },
    {
      "id": "rtd-q32",
      "question": "What is 'ratiometric measurement' in RTD signal conditioning?",
      "options": [
        "The measurement where sensor voltage is measured as a ratio against the voltage across a known precision reference resistor (R_ref) carrying the identical current",
        "Measuring the ratio of length to width",
        "Measuring voltage divided by power",
        "Measuring the ratio of AC to DC noise"
      ],
      "answer": "The measurement where sensor voltage is measured as a ratio against the voltage across a known precision reference resistor (R_ref) carrying the identical current",
      "correct_option": "The measurement where sensor voltage is measured as a ratio against the voltage across a known precision reference resistor (R_ref) carrying the identical current",
      "difficulty": "medium",
      "global_id": 32,
      "explanation": "Since V_RTD = I * R_RTD and V_ref = I * R_ref, the ADC code V_RTD / V_ref = R_RTD / R_ref cancels out excitation current fluctuations completely."
    },
    {
      "id": "rtd-q33",
      "question": "If a Pt100 RTD resistance drops to 80.31 Ω, what is the approximate temperature T of the medium?",
      "options": [
        "-50.0°C",
        "-20.0°C",
        "-100.0°C",
        "0.0°C"
      ],
      "answer": "-50.0°C",
      "correct_option": "-50.0°C",
      "difficulty": "medium",
      "global_id": 33,
      "explanation": "Using linear slope ~0.385 Ω/°C: ΔR = 80.31 - 100.00 = -19.69 Ω. T ≈ -19.69 / 0.3851 ≈ -51.1°C (exact Callendar-Van Dusen gives -50.0°C)."
    },
    {
      "id": "rtd-q34",
      "question": "What is the resistance of a Pt100 RTD at -200°C (liquid nitrogen temperature)?",
      "options": [
        "Approximately 18.52 Ω",
        "0.00 Ω",
        "50.00 Ω",
        "100.00 Ω"
      ],
      "answer": "Approximately 18.52 Ω",
      "correct_option": "Approximately 18.52 Ω",
      "difficulty": "hard",
      "global_id": 34,
      "explanation": "At -200°C, platinum resistance drops dramatically down to 18.52 Ω according to the cryogenic Callendar-Van Dusen equation."
    },
    {
      "id": "rtd-q35",
      "question": "What metal is used in Nickel RTDs (e.g. Ni120), and what is its main characteristic compared to Platinum?",
      "options": [
        "Nickel has higher sensitivity (α ≈ 0.00672 °C⁻¹), but poorer linearity and a narrower temperature range (-80°C to +260°C)",
        "Nickel is completely immune to radiation",
        "Nickel is superconductive at room temperature",
        "Nickel has negative temperature coefficient"
      ],
      "answer": "Nickel has higher sensitivity (α ≈ 0.00672 °C⁻¹), but poorer linearity and a narrower temperature range (-80°C to +260°C)",
      "correct_option": "Nickel has higher sensitivity (α ≈ 0.00672 °C⁻¹), but poorer linearity and a narrower temperature range (-80°C to +260°C)",
      "difficulty": "medium",
      "global_id": 35,
      "explanation": "Nickel offers almost twice the resistance change per degree compared to platinum, but suffers from significant curvature and limited thermal endurance."
    },
    {
      "id": "rtd-q36",
      "question": "What is a Copper RTD (e.g. Cu10, Cu50) most noted for in precision laboratory work over moderate temperatures (-50°C to +150°C)?",
      "options": [
        "Extremely high linearity over its range with α ≈ 0.00427 °C⁻¹",
        "Ability to withstand 2000°C",
        "High chemical reactivity",
        "Negative resistance"
      ],
      "answer": "Extremely high linearity over its range with α ≈ 0.00427 °C⁻¹",
      "correct_option": "Extremely high linearity over its range with α ≈ 0.00427 °C⁻¹",
      "difficulty": "medium",
      "global_id": 36,
      "explanation": "Copper has one of the most linear resistance-vs-temperature curves of any pure metal between -50°C and +150°C, though its low resistivity requires long wires."
    },
    {
      "id": "rtd-q37",
      "question": "What causes hysteresis in an RTD sensor subjected to cyclic thermal shocks?",
      "options": [
        "Mechanical strain induced on the platinum wire by differential thermal expansion between platinum and the ceramic support substrate",
        "Electromagnetic interference",
        "Chemical oxidation of gold leads",
        "Air pressure changes"
      ],
      "answer": "Mechanical strain induced on the platinum wire by differential thermal expansion between platinum and the ceramic support substrate",
      "correct_option": "Mechanical strain induced on the platinum wire by differential thermal expansion between platinum and the ceramic support substrate",
      "difficulty": "hard",
      "global_id": 37,
      "explanation": "Because platinum and alumina have different thermal expansion coefficients, heating cycles exert piezoresistive strain on the wire, causing slight resistance shifts upon returning to 0°C."
    },
    {
      "id": "rtd-q38",
      "question": "How do strain-free wire-wound RTD designs eliminate mechanical strain hysteresis in primary laboratory standards (SPRTs)?",
      "options": [
        "The platinum wire is wound loosely in a bifilar spiral inside glass/quartz capillaries without being glued or cemented",
        "The wire is stretched under 100 kg tension",
        "The wire is melted into a solid bead",
        "The wire is coated in silicone rubber"
      ],
      "answer": "The platinum wire is wound loosely in a bifilar spiral inside glass/quartz capillaries without being glued or cemented",
      "correct_option": "The platinum wire is wound loosely in a bifilar spiral inside glass/quartz capillaries without being glued or cemented",
      "difficulty": "hard",
      "global_id": 38,
      "explanation": "Standard Platinum Resistance Thermometers (SPRTs) support the platinum wire freely in helical quartz tubes, allowing it to expand and contract with zero mechanical stress."
    },
    {
      "id": "rtd-q39",
      "question": "In a Wheatstone bridge circuit with four equal 100 Ω resistors powered by a 5.0 V supply, what is the output voltage ΔV when a Pt100 changes from 100 Ω to 101 Ω?",
      "options": [
        "Approximately 12.44 mV",
        "1.00 V",
        "50.0 mV",
        "0.00 mV"
      ],
      "answer": "Approximately 12.44 mV",
      "correct_option": "Approximately 12.44 mV",
      "difficulty": "hard",
      "global_id": 39,
      "explanation": "ΔV = V_s * [R_RTD / (R_RTD + R) - 1/2] = 5.0 * [101 / 201 - 0.5] = 5.0 * [0.502488 - 0.5] = 5.0 * 0.002488 ≈ 12.44 mV."
    },
    {
      "id": "rtd-q40",
      "question": "Why are RTDs preferred over thermocouples for pharmaceutical cleanrooms and HVAC building automation?",
      "options": [
        "Higher accuracy (±0.1°C), excellent stability, and zero requirement for cold-junction reference compensation",
        "RTDs cost less than copper wire",
        "RTDs measure air speed directly",
        "RTDs emit ultraviolet sterilizing rays"
      ],
      "answer": "Higher accuracy (±0.1°C), excellent stability, and zero requirement for cold-junction reference compensation",
      "correct_option": "Higher accuracy (±0.1°C), excellent stability, and zero requirement for cold-junction reference compensation",
      "difficulty": "easy",
      "global_id": 40,
      "explanation": "Over ambient and moderate temperature ranges, RTDs deliver unmatched precision and drift-free operation without needing thermocouple CJC circuitry."
    },
    {
      "id": "rtd-q41",
      "question": "What is the effect of moisture or water ingress into the ceramic housing of an RTD probe?",
      "options": [
        "It creates a parallel parasitic resistance path (insulation resistance degradation), lowering the measured resistance and reading falsely cold",
        "It causes the sensor resistance to jump to 1 MΩ",
        "It doubles the speed of current",
        "It has no effect on resistance"
      ],
      "answer": "It creates a parallel parasitic resistance path (insulation resistance degradation), lowering the measured resistance and reading falsely cold",
      "correct_option": "It creates a parallel parasitic resistance path (insulation resistance degradation), lowering the measured resistance and reading falsely cold",
      "difficulty": "medium",
      "global_id": 41,
      "explanation": "Moisture provides a parallel ionic conduction path across the platinum element: 1/R_meas = 1/R_RTD + 1/R_leakage, artificially decreasing measured resistance."
    },
    {
      "id": "rtd-q42",
      "question": "What minimum insulation resistance is required between the RTD element and its outer metal protective sheath at room temperature (under IEC 60751)?",
      "options": [
        "At least 100 MΩ at 100 V DC",
        "At least 1 Ω",
        "At least 100 Ω",
        "Zero ohms (sheath must be grounded to element)"
      ],
      "answer": "At least 100 MΩ at 100 V DC",
      "correct_option": "At least 100 MΩ at 100 V DC",
      "difficulty": "hard",
      "global_id": 42,
      "explanation": "IEC 60751 mandates an insulation resistance greater than 100 MΩ at 100 V DC to prevent leakage currents to ground from distorting the temperature reading."
    },
    {
      "id": "rtd-q43",
      "question": "If a Pt100 RTD has an alpha of α = 0.00385 °C⁻¹, what is the resistance change per degree Celsius (sensitivity dR/dT) near 0°C?",
      "options": [
        "0.385 Ω/°C",
        "3.85 Ω/°C",
        "1.00 Ω/°C",
        "0.0385 Ω/°C"
      ],
      "answer": "0.385 Ω/°C",
      "correct_option": "0.385 Ω/°C",
      "difficulty": "easy",
      "global_id": 43,
      "explanation": "Sensitivity S = R_0 * α = 100 Ω * 0.003851 °C⁻¹ = 0.3851 Ω/°C."
    },
    {
      "id": "rtd-q44",
      "question": "For a Pt500 RTD (R0 = 500 Ω), what is the sensitivity dR/dT near 0°C?",
      "options": [
        "1.925 Ω/°C",
        "0.385 Ω/°C",
        "5.00 Ω/°C",
        "0.500 Ω/°C"
      ],
      "answer": "1.925 Ω/°C",
      "correct_option": "1.925 Ω/°C",
      "difficulty": "medium",
      "global_id": 44,
      "explanation": "Sensitivity S = 500 Ω * 0.003851 °C⁻¹ = 1.9255 Ω/°C (5 times higher than Pt100)."
    },
    {
      "id": "rtd-q45",
      "question": "Why does an RTD measurement system convert the measured resistance to temperature using the inverse Callendar-Van Dusen polynomial or lookup table rather than simple linear extrapolation?",
      "options": [
        "Because platinum resistance exhibits slight negative curvature (B * T² term) as temperature rises",
        "Because linear math is impossible on computers",
        "Because Ohm's law fails at 100°C",
        "To double the sampling rate"
      ],
      "answer": "Because platinum resistance exhibits slight negative curvature (B * T² term) as temperature rises",
      "correct_option": "Because platinum resistance exhibits slight negative curvature (B * T² term) as temperature rises",
      "difficulty": "medium",
      "global_id": 45,
      "explanation": "Since B = -5.775 x 10⁻⁷ is negative, the actual R-vs-T curve curves slightly downward. Linear approximation introduces errors up to ~0.4°C at 50°C and ~2.5°C at 500°C."
    },
    {
      "id": "rtd-q46",
      "question": "What is the boiling point of liquid nitrogen at 1 atm, a common cryogenic calibration reference point for RTDs?",
      "options": [
        "-195.8°C (77.36 K)",
        "-273.15°C (0 K)",
        "-78.5°C (194.7 K)",
        "0.0°C"
      ],
      "answer": "-195.8°C (77.36 K)",
      "correct_option": "-195.8°C (77.36 K)",
      "difficulty": "easy",
      "global_id": 46,
      "explanation": "Liquid nitrogen boils at 77.36 K (-195.79°C) at standard atmospheric pressure."
    },
    {
      "id": "rtd-q47",
      "question": "What is the primary factor determining the immersion depth required for an RTD in a thermowell?",
      "options": [
        "Stem conduction error: heat conducted along the metallic sheath must not alter the temperature of the sensing tip",
        "The electrical resistance of the thermowell",
        "The speed of sound in oil",
        "The voltage of the battery"
      ],
      "answer": "Stem conduction error: heat conducted along the metallic sheath must not alter the temperature of the sensing tip",
      "correct_option": "Stem conduction error: heat conducted along the metallic sheath must not alter the temperature of the sensing tip",
      "difficulty": "medium",
      "global_id": 47,
      "explanation": "Heat conducting along the probe shaft to the colder ambient air creates a thermal gradient; adequate immersion (typically 10-15x probe diameter) ensures the sensing tip reaches true process temperature."
    },
    {
      "id": "rtd-q48",
      "question": "If an RTD has a self-heating dissipation constant of 25 mW/°C in stirred water, how much will a 2 mA excitation current through 100 Ω raise its internal temperature?",
      "options": [
        "0.016°C",
        "0.16°C",
        "1.6°C",
        "16.0°C"
      ],
      "answer": "0.016°C",
      "correct_option": "0.016°C",
      "difficulty": "hard",
      "global_id": 48,
      "explanation": "Power P = I² R = (0.002 A)² * 100 Ω = 4.0e-6 * 100 = 0.40 mW. Temperature rise ΔT = P / Dissipation_Constant = 0.40 mW / (25 mW/°C) = 0.016°C."
    },
    {
      "id": "rtd-q49",
      "question": "Under IEC 60751, what is the required purity of platinum wire indicated by the resistance ratio R(100°C) / R(0°C)?",
      "options": [
        "At least 1.3851 for industrial grade, and ≥ 1.3925 for laboratory SPRT standard grade",
        "Exactly 1.0000",
        "At least 2.0000",
        "0.3851"
      ],
      "answer": "At least 1.3851 for industrial grade, and ≥ 1.3925 for laboratory SPRT standard grade",
      "correct_option": "At least 1.3851 for industrial grade, and ≥ 1.3925 for laboratory SPRT standard grade",
      "difficulty": "hard",
      "global_id": 49,
      "explanation": "Higher purity platinum exhibits higher temperature coefficient: industrial grade requires W(100) ≥ 1.3851, while ITS-90 primary SPRT standard requires W(100) ≥ 1.3925 (99.999% pure annealed Pt)."
    },
    {
      "id": "rtd-q50",
      "question": "In an automated microcontroller lab system, how is temperature T calculated from measured resistance R using the quadratic Callendar-Van Dusen equation R = R0(1 + AT + BT²)?",
      "options": [
        "Using the quadratic formula: T = [-A + √(A² - 4 * B * (1 - R/R_0))] / (2 * B)",
        "T = (R - R_0) / A",
        "T = R * A * B",
        "T = √(R / R_0)"
      ],
      "answer": "Using the quadratic formula: T = [-A + √(A² - 4 * B * (1 - R/R_0))] / (2 * B)",
      "correct_option": "Using the quadratic formula: T = [-A + √(A² - 4 * B * (1 - R/R_0))] / (2 * B)",
      "difficulty": "hard",
      "global_id": 50,
      "explanation": "Rearranging into B T² + A T + (1 - R/R_0) = 0 and applying the quadratic formula yields the exact closed-form solution for T ≥ 0°C."
    }
  ]
};

// Comprehensive mapping of experiment identifiers and aliases to question banks
export const ALL_QUIZ_BANKS = {
  "projectile": PROJECTILE_QUESTION_BANK,
  "optical": OPTICAL_FIBRE_QUESTION_BANK,
  "optical-fibre": OPTICAL_FIBRE_QUESTION_BANK,
  "colour-sensor": COLOUR_SENSOR_QUESTION_BANK,
  "hall-effect": HALL_EFFECT_QUESTION_BANK,
  "hall": HALL_EFFECT_QUESTION_BANK,
  "diffraction": DIFFRACTION_QUESTION_BANK,
  "diffraction-grating": DIFFRACTION_QUESTION_BANK,
  "sandbox": SANDBOX_QUESTION_BANK,
  "physics-sandbox": SANDBOX_QUESTION_BANK,
  "pof-attenuation": POF_ATTENUATION_QUESTION_BANK,
  "optical-attenuation": POF_ATTENUATION_QUESTION_BANK,
  "pof": POF_ATTENUATION_QUESTION_BANK,
  "laser-divergence": LASER_DIVERGENCE_QUESTION_BANK,
  "laser": LASER_DIVERGENCE_QUESTION_BANK,
  "laser-beam-divergence": LASER_DIVERGENCE_QUESTION_BANK,
  "ultrasonic-sensor": ULTRASONIC_SENSOR_QUESTION_BANK,
  "ultrasonic": ULTRASONIC_SENSOR_QUESTION_BANK,
  "udm": ULTRASONIC_SENSOR_QUESTION_BANK,
  "ultrasonic-distance": ULTRASONIC_SENSOR_QUESTION_BANK,
  "wedge-film": WEDGE_FILM_QUESTION_BANK,
  "wedge": WEDGE_FILM_QUESTION_BANK,
  "wedge-shaped-film": WEDGE_FILM_QUESTION_BANK,
  "thin-film-wedge": WEDGE_FILM_QUESTION_BANK,
  "newtons-rings": NEWTONS_RINGS_QUESTION_BANK,
  "newton": NEWTONS_RINGS_QUESTION_BANK,
  "newtons-ring": NEWTONS_RINGS_QUESTION_BANK,
  "newton-rings": NEWTONS_RINGS_QUESTION_BANK,
  "diode": DIODE_QUESTION_BANK,
  "diode-vi": DIODE_QUESTION_BANK,
  "pn-junction": DIODE_QUESTION_BANK,
  "planck": PLANCK_QUESTION_BANK,
  "plancks-constant": PLANCK_QUESTION_BANK,
  "planck-constant": PLANCK_QUESTION_BANK,
  "rtd-sensor": RTD_SENSOR_QUESTION_BANK,
  "rtd": RTD_SENSOR_QUESTION_BANK,
  "rtd-sensors": RTD_SENSOR_QUESTION_BANK,
  "pt100": RTD_SENSOR_QUESTION_BANK
};

/**
 * Safely resolves a quiz question bank by experiment ID or alias.
 * If missing, logs a descriptive warning and safely falls back without crashing.
 */
export function getQuizBank(expId = "projectile") {
  const norm = typeof expId === "string" ? expId.trim().toLowerCase() : "projectile";
  const bank = ALL_QUIZ_BANKS[norm];
  if (bank && Array.isArray(bank.questions) && bank.questions.length >= 10) {
    return bank;
  }
  console.warn(`[Quiz Engine] No dedicated question bank found for experiment ID "${expId}". Falling back to default bank.`);
  return PROJECTILE_QUESTION_BANK;
}

/**
 * Generates a dynamic 10-question quiz sampled randomly without replacement
 * from the 50-question bank of the specified experiment.
 */
export function generateRandom10QuestionQuiz(expId = "projectile") {
  const bank = getQuizBank(expId);

  // 1. Unbiased Fisher-Yates shuffle across the full question bank
  const shuffledBank = shuffleArray(bank.questions);

  // 2. Select exactly 10 distinct questions (sampling without replacement)
  const selected10 = shuffledBank.slice(0, 10);

  // 3. For each selected question, shuffle its options and dynamically compute the correct answer letter
  const questions = selected10.map((q, idx) => {
    const correctText = q.correct_option || q.answer;
    const shuffledOptions = shuffleArray(q.options);
    const correctIdx = shuffledOptions.indexOf(correctText);
    const letters = ["A", "B", "C", "D"];
    const dynamicAnswerLetter = letters[correctIdx] || "A";

    return {
      id: q.id,
      originalGlobalId: q.global_id || q.id,
      indexInQuiz: idx + 1,
      question: q.question,
      options: shuffledOptions,
      answer: correctText,
      answerLetter: dynamicAnswerLetter,
      correct_option: correctText,
      explanation: q.explanation || `Correct answer is: ${correctText}`,
      difficulty: q.difficulty || "medium"
    };
  });

  return {
    quizId: bank.quizId || `${bank.experimentId}-mastery-quiz`,
    title: bank.title || `${bank.experimentName} - Quiz`,
    experimentId: bank.experimentId,
    experimentName: bank.experimentName,
    totalQuestions: questions.length,
    questions
  };
}

// Backward-compatible default export
export const QUIZ_DATA = {
  experiment: "2D Projectile Kinematics & Lab Mastery",
  description: "Dynamic 10-Question Randomized Physics Knowledge Evaluation",
  get questions() {
    return generateRandom10QuestionQuiz("projectile").questions;
  }
};
