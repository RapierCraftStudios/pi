import { randomUUID } from "node:crypto";
import type { ImageContent } from "@earendil-works/pi-ai";

export interface PendingImageAttachment {
	id: string;
	index: number;
	marker: string;
	image: ImageContent;
}

export interface SubmittedInput {
	text: string;
	images?: ImageContent[];
}

/**
 * Keeps clipboard images in memory while the editor contains lightweight,
 * user-removable markers. A submission consumes the queue exactly once.
 */
export class PendingImageAttachments {
	private attachments: PendingImageAttachment[] = [];
	private nextIndex = 1;

	add(image: ImageContent): PendingImageAttachment {
		const index = this.nextIndex++;
		const attachment = {
			id: randomUUID(),
			index,
			marker: `[Image #${index}]`,
			image,
		};
		this.attachments.push(attachment);
		return attachment;
	}

	consume(text: string): SubmittedInput {
		const images = this.attachments
			.filter((attachment) => text.includes(attachment.marker))
			.map((attachment) => attachment.image);
		this.clear();
		return images.length ? { text, images } : { text };
	}

	clear(): void {
		this.attachments = [];
		this.nextIndex = 1;
	}

	get size(): number {
		return this.attachments.length;
	}
}
