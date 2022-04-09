Linguist
========

A project inspired by FormatJS and Qt Linguist
- Extract messages from your source codes.
- Automatically generate a unique id for each message.
- Generate strings in JSON format where translators can work on.
- Release string bundles as JavaScript scripts.

## License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

## Usage

1. Install Linguist as a development dependency.

	```bash
	npm i -D @karuta/linguist
	```

1. For React projects, install `react-intl` and wrap your messages.
		
	```TypeScript
	import {
		useIntl,
		defineMessages,
		FormattedMessage,
		IntlShape,
	} from 'react-intl';

	// Define a set of messages
	const desc = defineMessages({
		emptyRoomNumber: { defaultMessage: 'Please input a room number.' },
		// ...
	});

	// Use pre-defined messages
	export function YourComponentA(): JSX.Element {
		const intl = useIntl();

		return (
			<input
				type="number"
				inputMode="decimal"
				placeholder={intl.formatMessage(desc.roomNumber)}
			/>
		);
	}

	// Directly use <FormattedMessage>
	export function YourComponentB(): JSX.Element {		
		return (
			<FormattedMessage defaultMessage="This is a test." />
		);
	}
	```

1. Add a `.linguistrc.js` to your root folder to configure targeted languages and define an override id function.
	```JavaScript
	/**
	 * @type {import('@karuta/linguist').Config}
	*/
	module.exports = {
		locales: [
			'en-US',
			'en-GB',
			'zh-Hans',
			'zh-Hant',
			'yue',
			'ja-JP',
		],
		overrideIdFn: '[sha512:contenthash:base64:6]',
	};
	```

1. Generate messages.
	```bash
	npx linguist update
	```

1. Add translations to the JSON files (e.g. `message/ja-JP.json`).

1. Release messages.
	```bash
	npx linguist release
	```

1. Prune unused messages whenever you deleted some old strings.
	```bash
	npx linguist prune
	```

## Configuration

```JavaScript
/**
 * @type {import('@karuta/linguist').Config}
*/
module.exports = {
	/**
	 * Supported locales of the application. Each locale has a separate file. Default: en-US, zh-CN.
	 */
	locales: [
		'en-US', // English (United States)
		'en-GB', // English (United Kingdom)
		'zh-Hans', // 中文（简体）
		'zh-Hant', // 中文（繁体）
		'ja-JP', // 日本語
	],

	/**
	 * If no explicit id is defined, generate an automatic id for the message.
	 */
	overrideIdFn: '[sha512:contenthash:base64:6]',
	
	/**
	 * The directory to look for source files. Default: 'src'.
	 */
	sourceDir: 'src',

	/**
	 * The directory to save messages extracted from source files. Default: 'message'.
	 */
	messageDir: 'message',
};
```
