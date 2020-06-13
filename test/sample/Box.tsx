import React from 'react';
import { FormattedMessage } from 'react-intl';

import './index.scss';

function Box() {
	return (
		<div className="lobby">
			<div className="info-panel">
				<i className="logo" />
			</div>
			<div className="entrance-form">
				<button type="submit" onClick={this.createRoom}>
					<FormattedMessage id="create-room" defaultMessage="Create Room" />
				</button>
				<input
					id="room-number-input"
					type="number"
					className="room-number"
					placeholder="房间号"
					maxLength={8}
				/>
				<button type="submit">
					<FormattedMessage id="enter-room" defaultMessage="Enter Room" />
				</button>
			</div>
		</div>
	);
}

export default Box;
