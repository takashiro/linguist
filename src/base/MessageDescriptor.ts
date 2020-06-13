import { MessageDescriptor as Descriptor } from '@formatjs/ts-transformer';

interface MessageDescriptor extends Descriptor {
	message?: string;
}

export default MessageDescriptor;
