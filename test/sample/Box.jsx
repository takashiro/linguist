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
					<FormattedMessage defaultMessage="Happy Work" />
				</button>
				<button type="submit">
					<FormattedMessage defaultMessage="Happy Life" />
				</button>
			</div>
		</div>
	);
}

export default Box;
