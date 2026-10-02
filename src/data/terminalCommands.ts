/** Playful local responses; these commands never execute shell code. */
export const terminalCommands = [
  {
    command: "make magic",
    art: "       *\n   *  / \\  *\n     /___\\\n      | |\n  ____|_|____",
    message: "No magic. Just curiosity, debugging, and one more commit.",
  },
  {
    command: "train dragon",
    art: "       /\\_/\\\n   ___( o.o )___\n  /    > ^ <    \\\n /_______________\\",
    message: "Small model. Big ambitions. Please don't eat the training data.",
  },
  {
    command: "ask ai",
    art: "     .--------.\n     |  o  o  |\n     |   __   |\n     '---[]---'\n        /||\\",
    message: "Confident answer detected. Evidence still loading.",
  },
  {
    command: "git grow",
    art: "        \\ | /\n         \\|/\n      ----*----\n          |\n         / \\\n    ____/___\\____",
    message: "Another branch. Another lesson. Growth rarely looks like a straight line.",
  },
  {
    command: "debug universe",
    art: "      .       *\n   *    .---.     .\n       / o o \\\n       \\  ~  /\n    .   '---'   *",
    message: "Cannot reproduce the universe. Works on my machine.",
  },
  {
    command: "brew intelligence",
    art: "       ( (\n        ) )\n      .-----.\n      | AI  |]\n      |     |\n      '-----'",
    message: "Two parts curiosity. One part compute. Stir. Evaluate. Repeat.",
  },
  {
    command: "deploy hope",
    art: "         /\\\n        /  \\\n        |[]|\n        |  |\n       /|  |\\\n      /_|__|_\\\n        /\\/\\",
    message: "All checks passed.*\n*Existential checks still pending.",
  },
];

function chooseCommand() {
  let previous: string | null = null;
  try {
    previous = window.sessionStorage.getItem("workbench-command");
  } catch {
    // Random selection also works when browser storage is unavailable.
  }
  const options = terminalCommands.filter((item) => item.command !== previous);
  const selected = options[Math.floor(Math.random() * options.length)];
  try {
    window.sessionStorage.setItem("workbench-command", selected.command);
  } catch {
    // Storage is optional; it only prevents consecutive repeats.
  }
  return selected;
}

// Choose once per page load, keeping the command stable across route changes.
export const terminalCommand = chooseCommand();
