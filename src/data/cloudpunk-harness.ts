// Cloudpunk VRevival's in-game test harness, as data for the motion phase.
// Read from the mod's development repository on 2026-11-20 (commit 0cd3afd): tools/test/Run-VRTest.ps1,
// tools/test/NullHeadset.psm1 and tests/steps/*.txt, aligned on 2026-11-20 with the set prepared for the
// public repository (branch test-harness, 1a99aa0; links below work once it is pushed).
export const harnessSource = "https://github.com/NathanKneT/CloudpunkVRevival/tree/main/tools/test"
export const scenariosSource = "https://github.com/NathanKneT/CloudpunkVRevival/tree/main/tests/steps"
//
// Nothing here says a run passed or failed, or that a scenario gates a merge: the files only show what
// each scenario does.

// What a run does around the steps (Run-VRTest.ps1:1-12, NullHeadset.psm1:1-10).
export const harnessRun = [
  "Take the lock, so only one run uses SteamVR at a time",
  "Switch SteamVR to its built-in null headset driver",
  "Launch the game with the mod",
  "Play the step file, one command per line",
  "Save captures and logs",
  "Always restore SteamVR’s settings, the save folder, the mod settings and the lock, even on failure",
]

export type StepCommand = {
  name: "wait" | "waitlog" | "cmd" | "capture" | "mirror" | "unitylog"
  syntax: string
  does: string
}

// The step-file grammar: one command per line (Run-VRTest.ps1:3-8, and the switch at lines 284-296).
// A line starting with # is a comment. ${Name} in a step is replaced by a value passed to the run.
export const stepGrammar: StepCommand[] = [
  { name: "wait", syntax: "wait <seconds>", does: "Sleep." },
  {
    name: "waitlog",
    syntax: "waitlog <regex> [timeout]",
    does: "Wait until the BepInEx log matches; 120 seconds unless a timeout is given.",
  },
  {
    name: "cmd",
    syntax: "cmd <developer command...>",
    does: "Send a developer command to the mod (DevCommands.cs).",
  },
  {
    name: "capture",
    syntax: "capture <name>",
    does: "Save the SteamVR headset window to tests/captures/<name>.png.",
  },
  {
    name: "mirror",
    syntax: "mirror <name>",
    does: "Save the game’s desktop window (the left eye’s mirror) to <name>-mirror.png.",
  },
  {
    name: "unitylog",
    syntax: "unitylog <regex>",
    does: "Count the lines of Unity’s own log that match, so far.",
  },
]

// The category follows the public repository's layout: regression scenarios sit in tests/steps/,
// probes and filming tools in tests/steps/tools-and-probes/.
export type ScenarioCategory = "regression" | "tool"

export type Scenario = {
  file: string
  label: string
  category: ScenarioCategory
}

// The published step files, in name order: tests/steps/ (regression) and tests/steps/tools-and-probes/.
// Five early probes stayed private and are not listed. There is no 58, and two files are numbered 68.
export const scenarios: Scenario[] = [
  { file: "01-boot.txt", label: "First boot: OpenVR comes up after the preloader patch", category: "regression" },
  { file: "02-ingame.txt", label: "Menu, then the existing save, with camera driver and UI panel", category: "regression" },
  { file: "03-ingame.txt", label: "Render hook in place of the stripped onBeforeRender", category: "regression" },
  { file: "06-tour.txt", label: "Title, main menu, cockpit, inventory, map, on foot", category: "regression" },
  { file: "07-features.txt", label: "Laser on the menu, cockpit, view toggle, vignette, snap turn", category: "regression" },
  { file: "08-cockpit.txt", label: "Cockpit in both eyes, laser raycast, on foot", category: "regression" },
  { file: "09-laser.txt", label: "Laser: hover selects, trigger confirms", category: "regression" },
  { file: "10-main-views.txt", label: "Build tour: the captures used in the README", category: "regression" },
  { file: "12-prompts.txt", label: "Button prompts follow the controller", category: "regression" },
  { file: "13-prompts-menu.txt", label: "Prompts on the UI panel, PlayStation then Xbox", category: "regression" },
  { file: "14-flat-auto.txt", label: "No SteamVR: the game starts flat and says why", category: "regression" },
  { file: "15-vr-regression.txt", label: "Patches apply, nothing throws, effects scale", category: "regression" },
  { file: "16-effects.txt", label: "The drink effect at Full, then Reduced", category: "regression" },
  { file: "17-art-perf.txt", label: "What the game’s look is made of, and the performance settings", category: "tool" },
  { file: "18-hands.txt", label: "Hands in the menu, the cockpit, on foot and at the pause menu", category: "regression" },
  { file: "19-menus-eyes.txt", label: "Menus in front of the eyes, an option changed with the stick", category: "regression" },
  { file: "20-options.txt", label: "Title menu under the sign, options through the laser", category: "regression" },
  { file: "21-hands-sheet.txt", label: "Model sheet of the hands in the cockpit", category: "tool" },
  { file: "22-mechanics.txt", label: "The game’s bindings and special mechanics per place", category: "tool" },
  { file: "23-steam-launch.txt", label: "Launched by Steam while SteamVR already runs", category: "regression" },
  { file: "25-label-scale.txt", label: "Stereo test label and automatic render scale", category: "regression" },
  { file: "27-transition-guard.txt", label: "The transition guard stays quiet in normal play", category: "regression" },
  { file: "28-rain.txt", label: "Which rain the game draws, seen from a headset", category: "tool" },
  { file: "29-world-rain.txt", label: "Rain around the head on foot", category: "regression" },
  { file: "30-uimap.txt", label: "What the wrist, the hands and the HUD read", category: "tool" },
  { file: "31-qol.txt", label: "Menu card, HUD on the windscreen, wrist, jog", category: "regression" },
  { file: "32-wrist-lines.txt", label: "A line from the game reaching the wrist", category: "regression" },
  { file: "33-jog.txt", label: "Jog on foot", category: "regression" },
  { file: "34-look.txt", label: "Look highlight on foot", category: "regression" },
  { file: "35-items.txt", label: "Which items the loaded district holds", category: "tool" },
  { file: "36-wheel.txt", label: "The wheel in the hands, with simulated tracking faults", category: "regression" },
  { file: "37-charm.txt", label: "The cockpit charm on its chain", category: "regression" },
  { file: "38-hud.txt", label: "The interface sized in degrees", category: "regression" },
  { file: "39-perf.txt", label: "What each part of the image costs", category: "tool" },
  { file: "40-district.txt", label: "District passages, flying in the cockpit", category: "regression" },
  { file: "41-autoscale.txt", label: "Automatic render scale at work", category: "regression" },
  { file: "42-boarding.txt", label: "Getting back into the HOVA, timed", category: "regression" },
  { file: "43-vignette.txt", label: "The comfort vignette in flight", category: "regression" },
  { file: "44-coffee.txt", label: "The coffee cup, without controllers", category: "regression" },
  { file: "45-hova-body.txt", label: "The HOVA’s body and windows while it banks", category: "regression" },
  { file: "46-glass.txt", label: "The windows alike in both eyes", category: "regression" },
  { file: "47-lever.txt", label: "The lift lever in the hand", category: "regression" },
  { file: "48-mirrors.txt", label: "The HOVA’s mirrors", category: "regression" },
  { file: "49-coffee-throw.txt", label: "Throwing the coffee into the cabin", category: "regression" },
  { file: "50-map.txt", label: "Map and pause menu from one-frame presses", category: "regression" },
  { file: "51-hands-open.txt", label: "Hands open at rest, fingers following the controller", category: "regression" },
  { file: "52-fog-eyes.txt", label: "The city’s fog alike in both eyes", category: "regression" },
  { file: "53-title.txt", label: "The title screen passes by itself in VR", category: "regression" },
  { file: "54-title-kept.txt", label: "The title prompt kept for one run", category: "regression" },
  { file: "55-title-eyes.txt", label: "What makes the title’s lights differ between the eyes", category: "regression" },
  { file: "56-volumetric-eyes.txt", label: "Volumetric light alike in both eyes", category: "regression" },
  { file: "57-hud-trader.txt", label: "The HUD at a trader", category: "regression" },
  { file: "59-freecam.txt", label: "The free camera for filming, run flat", category: "regression" },
  { file: "60-menu-sign.txt", label: "The VREVIVAL sign on the main menu", category: "regression" },
  { file: "61-wheel-lock.txt", label: "The wheel’s power steering, measured", category: "regression" },
  { file: "62-call.txt", label: "Calls and lines in the cockpit, shown once", category: "regression" },
  { file: "63-spectator.txt", label: "The spectator view for recording", category: "regression" },
  { file: "64-clean-frame.txt", label: "The clean frame for filming", category: "regression" },
  { file: "65-clean-frame-flat.txt", label: "The clean frame in the flat game", category: "regression" },
  { file: "66-vrevival-menu.txt", label: "The VREVIVAL settings menu, driven like a player", category: "regression" },
  { file: "67-render.txt", label: "Render bench: one free camera shot, frame by frame", category: "tool" },
  { file: "68-title-cinema-vr.txt", label: "The clean main menu in VR", category: "regression" },
  { file: "68-title-cinema.txt", label: "The title shot, flat at 2560x1440", category: "tool" },
  { file: "69-district-goto.txt", label: "District trips for filming, flat", category: "tool" },
  { file: "70-tutorial-camera.txt", label: "The on-foot camera and its tutorial in VR", category: "regression" },
]

export type AnnotatedStep = {
  // The line as it is in the file.
  line: string
  // What it does, from the file's own header comment and the grammar above.
  note: string
}

// tests/steps/36-wheel.txt: the wheel held by simulated hands, then one tracking fault at a time.
// A selection of its step lines, in file order; the header comment (lines 1-22) explains each part.
export const wheelExample = {
  file: "36-wheel.txt",
  summary:
    "Both simulated hands take the wheel, turn it to each stop, then one hand’s tracking jumps, freezes and drifts in turn. After each change the mod logs the wheel’s state and its own checks.",
  // The line the mod logs when its checks pass (header comment, lines 19-21).
  expectedLog: "check: sides ok steer ok wheel ok",
  steps: [
    { line: "waitlog Scenes: Main 120", note: "Wait until the log shows the main scene, 120 seconds at most." },
    { line: "cmd continue", note: "Load the existing save, as the menu’s Continue does." },
    { line: "waitlog Cockpit view on 220", note: "Wait until the cockpit view is on." },
    { line: "cmd wheel lock 35", note: "Set the wheel’s stop to 35 degrees: the player’s file may hold another value." },
    { line: "cmd wheel grab both", note: "Both hands close on the rim at a quarter to three." },
    { line: "cmd wheel", note: "Log the wheel’s state and run the checks. This line comes back after every change." },
    { line: "capture 36-wheel-grab", note: "Save what the headset shows." },
    { line: "mirror 36-wheel-grab", note: "Save the game’s desktop window too." },
    { line: "cmd wheel turn 45", note: "Turn the hands 45 degrees: the wheel stops at 35 and the hands slide on." },
    { line: "cmd wheel turn -90", note: "Turn to the left stop." },
    { line: "cmd wheel release", note: "Let go: the wheel springs back." },
    { line: "cmd wheel jump left", note: "Tracking fault: the left hand jumps. It stops steering, then steers again." },
    { line: "cmd wheel freeze left", note: "Tracking fault: the left hand freezes while the other hand turns the wheel." },
    { line: "cmd wheel drift left", note: "Tracking fault: the left hand drifts away from the other. The wheel holds, then takes a new grip." },
    { line: "cmd wheel thaw", note: "End the fault." },
  ] as AnnotatedStep[],
}
