/**
 * Update the game mode selector to match the current URL.
 * @param {HTMLSelectElement} gameModeSelect
 */
export function setupGameModeSwitcher(gameModeSelect) {
	const syncFromUrl = () => {
		const params = new URLSearchParams(window.location.search);
		const rawMode = params.get('game');
		const mode = rawMode === 'ko' ? 'ko' : rawMode === '8dx' ? '8dx' : 'vs';
		gameModeSelect.value = mode;
	};

	syncFromUrl();

	gameModeSelect.addEventListener('change', () => {
		const params = new URLSearchParams(window.location.search);
		const mode = gameModeSelect.value;

		if (mode === 'vs') {
			params.delete('game');
		}
		else {
			params.set('game', mode);
		}

		const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
		window.location.assign(nextUrl);
	});
}
