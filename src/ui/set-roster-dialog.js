import { t } from "../i18n/i18n.js";
import { getGameMode } from "../util.js";
import { Roster, MAX_ROSTER_SIZE, getAllowedRosterSizes } from "../roster.js";
import { error, success } from "./toast.js";


function makeDialog() {
	const dialog = document.createElement('dialog');
	dialog.innerHTML = `
		<form method="dialog" class="modal">
			<h3>${t('rosterSetup.title')}</h3>
			<p class="muted">${t('rosterSetup.instructions', { count: MAX_ROSTER_SIZE })}</p>
			<textarea rows="${MAX_ROSTER_SIZE}" placeholder="Room 1 MMR: 9999 - Tier A&#xA;1. Player1, Player2 (9999 MMR)&#xA;...&#xA;&#xA;-- or for a war --&#xA;&#xA;WAR - Tag1 vs Tag2&#xA;1. P1, P2, P3, P4, P5, P6&#xA;2. P7, P8, P9, P10, P11, P12"></textarea>
			<footer>
				<button type="button" value="cancel">${t('cancel')}</button>
				<button type="button" class="btn--primary">${t('confirm')}</button>
			</footer>
		</form>
	`;
	const input = /** @type {HTMLTextAreaElement} */(dialog.querySelector('textarea'));
	const cancel = /** @type {HTMLButtonElement} */(dialog.querySelector('button[value=cancel]'));
	const confirm = /** @type {HTMLButtonElement} */(dialog.querySelector('.btn--primary'));
	document.body.append(dialog);
	dialog.addEventListener('close', () => dialog.remove());
	return { dialog, input, cancel, confirm };
}

/**
 * @param {HTMLButtonElement} btn
	 * @returns {Promise<Roster>}
 */
export function requestRoster(btn) {
	return new Promise(resolve => {
		btn.addEventListener('click', () => {
			const { dialog, input, cancel, confirm } = makeDialog();
			dialog.showModal();
			input.focus();
			cancel.addEventListener('click', () => {
				dialog.close();
			});
			confirm.addEventListener('click', () => {
				try {
					const roster = Roster.parse(input.value);
					const allowedSizes = getAllowedRosterSizes(getGameMode());
					if( !allowedSizes.includes(roster.size) ) throw new Error(t('rosterSetup.wrongLength', { count: allowedSizes.join(' / '), actual: roster.size }));
					dialog.close();
					success(t('rosterSetup.rosterLoaded'));
					resolve(roster);
				} catch(err) {
					error(/** @type {any} */(err).message || err);
				}
			});
		});
	});
}
