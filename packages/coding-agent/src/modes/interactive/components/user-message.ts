import type { ImageContent } from "@earendil-works/pi-ai";
import { Box, Container, Image, Markdown, type MarkdownTheme, Spacer } from "@earendil-works/pi-tui";
import { getMarkdownTheme, theme } from "../theme/theme.ts";

const OSC133_ZONE_START = "\x1b]133;A\x07";
const OSC133_ZONE_END = "\x1b]133;B\x07";
const OSC133_ZONE_FINAL = "\x1b]133;C\x07";

/**
 * Component that renders a user message
 */
export class UserMessageComponent extends Container {
	private text: string;
	private markdownTheme: MarkdownTheme;
	private outputPad: number;
	private images: ImageContent[];
	private showImages: boolean;
	private imageWidthCells: number;

	constructor(
		text: string,
		markdownTheme: MarkdownTheme = getMarkdownTheme(),
		outputPad = 1,
		images: readonly ImageContent[] = [],
		showImages = true,
		imageWidthCells = 60,
	) {
		super();
		this.text = text;
		this.markdownTheme = markdownTheme;
		this.outputPad = outputPad;
		this.images = [...images];
		this.showImages = showImages;
		this.imageWidthCells = imageWidthCells;
		this.rebuild();
	}

	setOutputPad(padding: number): void {
		this.outputPad = padding;
		this.rebuild();
	}

	private rebuild(): void {
		this.clear();
		const contentBox = new Box(this.outputPad, 1, (content: string) => theme.bg("userMessageBg", content));
		contentBox.addChild(
			new Markdown(
				this.text,
				0,
				0,
				this.markdownTheme,
				{
					color: (content: string) => theme.fg("userMessageText", content),
				},
				{ preserveOrderedListMarkers: true, preserveBackslashEscapes: true },
			),
		);
		this.addChild(contentBox);
		if (this.showImages) {
			for (const image of this.images) {
				this.addChild(new Spacer(1));
				this.addChild(
					new Image(
						image.data,
						image.mimeType,
						{ fallbackColor: (content: string) => theme.fg("userMessageText", content) },
						{ maxWidthCells: this.imageWidthCells },
					),
				);
			}
		}
	}

	override render(width: number): string[] {
		const lines = super.render(width);
		if (lines.length === 0) {
			return lines;
		}

		lines[0] = OSC133_ZONE_START + lines[0];
		lines[lines.length - 1] = OSC133_ZONE_END + OSC133_ZONE_FINAL + lines[lines.length - 1];
		return lines;
	}
}
