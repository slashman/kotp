import { Text } from 'pixi.js';
import {sprintf} from 'sprintf-js'
import EnglishBundle from './EnglishBundle';
import SpanishBundle from './SpanishBundle';


export default class Loc {
	private static bundle: Map<string, string>;
	private static bundles: Map<string,Map<string, string>>;
	private static textComponents: { text: Text, updateSpec: string | (() => string)}[];

	public static init (): void {
		Loc.textComponents = [];
		Loc.bundles = new Map();
		Loc.addBundle("en", EnglishBundle);
		Loc.addBundle("es", SpanishBundle);
	}

	public static addBundle (langKey: string, bundle: Map<string, string>): void {
		Loc.bundles.set(langKey, bundle);
	}

	public static setBundle (langKey: string) {
		Loc.bundle = Loc.bundles.get(langKey);
		Loc.updateTextComponents();
	}

	public static updateTextComponents () {
		Loc.textComponents.forEach (textComponent => {
			if (typeof textComponent.updateSpec === 'string') {
				textComponent.text.text = Loc.loc(textComponent.updateSpec);
			} else {
				textComponent.text.text = textComponent.updateSpec();
			}
		});
	}

	public static locAll (keys: string[], ...args: any[]): string[] {
		return keys.map(key => Loc.loc(key, ...args));
	}

	public static loc (key: string, ...args: any[]): string {
		if (!Loc.bundle.has(key)) {
			return `{${key}}`
		}
		return sprintf(Loc.bundle.get(key), ...args);
	}

	public static registerTextComponent (text: Text, updateSpec: string | (() => string)) {
		Loc.textComponents.push({text, updateSpec})
	}
}