import { Config, getGameMode } from "../util.js";

/**
 * Update the game mode selector to match the saved game mode.
 * @param {HTMLSelectElement} gameModeSelect
 */
export function setupGameModeSwitcher(gameModeSelect) {
	for (const option of gameModeSelect.options) {
		if (option.disabled) {
			option.classList.remove(`gm_${option.value}`);
		}
	}

	/** @param {string} mode */
	const updateModeClass = (mode) => {
		gameModeSelect.classList.remove('gm_vs', 'gm_ko', 'gm_8dx');
		if (!gameModeSelect.selectedOptions[0]?.disabled) {
			gameModeSelect.classList.add(`gm_${mode}`);
		}
	};

	const syncFromStorage = () => {
		const mode = getGameMode();
		gameModeSelect.value = mode;
		updateModeClass(mode);
	};

	syncFromStorage();

	gameModeSelect.addEventListener('change', () => {
		const mode = gameModeSelect.value;
		Config.set('gameMode', mode);
		updateModeClass(mode);
	});
}
