export class Contest {
	textField: string;
	nodeCronSettings: string;

	constructor(textField :string, nodeCronSettings :string) {
		this.textField = textField;
		this.nodeCronSettings = nodeCronSettings;
	}
}