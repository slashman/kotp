import { Text } from 'pixi.js';

export default {
	createTextBox(x, y, fontSize, textColor, initialText, wordWrapWidth?, fontFamily?: string, align?: 'left' | 'center') {
		const textBox = new Text(initialText, {
			fontFamily: fontFamily || 'gameFont',
			fontSize: fontSize,
			fill: textColor,
			align: align || 'left',
			wordWrap: !!wordWrapWidth,
			wordWrapWidth: wordWrapWidth,
			lineHeight: 40
		});
		textBox.scale.x = 0.25;
		textBox.scale.y = 0.25;
		textBox.position.x = x;
		textBox.position.y = y;
		textBox.text = initialText;
		return textBox;
	}
}