type Selection = {
	anchor: number;
	head: number;
};

type UpdateListener = (update: { docChanged: boolean; selectionSet: boolean; state: EditorView["state"] }) => void;

function clamp(value: number, text: string) {
	return Math.max(0, Math.min(value, text.length));
}

function lineAt(text: string, position: number) {
	const nextPosition = clamp(position, text);
	const lines = text.split("\n");
	let cursor = 0;

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index]!;
		const end = cursor + line.length;
		if (nextPosition <= end) return { number: index + 1 };
		cursor = end + 1;
	}

	return { number: lines.length };
}

export class EditorView {
	static readonly instances: EditorView[] = [];

	static readonly updateListener = {
		of(listener: UpdateListener) {
			return {
				__listener: listener,
			};
		},
	};

	private text: string;
	private readonly listener?: UpdateListener;
	destroyed = false;

	readonly state: {
		doc: {
			toString: () => string;
			lineAt: (position: number) => { number: number };
		};
		selection: {
			ranges: [{ from: number; to: number }];
			main: Selection;
		};
	};

	constructor(options: { doc?: string; extensions?: unknown[] }) {
		this.text = options.doc ?? "";
		this.listener = options.extensions?.find((extension) => {
			return typeof extension === "object" && extension !== null && "__listener" in extension;
		})?.__listener as UpdateListener | undefined;

		const selection: Selection = { anchor: 0, head: 0 };
		this.state = {
			doc: {
				toString: () => this.text,
				lineAt: (position: number) => lineAt(this.text, position),
			},
			selection: {
				ranges: [{ from: 0, to: 0 }],
				main: selection,
			},
		};

		EditorView.instances.push(this);
	}

	dispatch(payload: {
		changes?: {
			from: number;
			to: number;
			insert: string;
		};
		selection?: Selection;
	}) {
		if (payload.changes) {
			const { from, to, insert } = payload.changes;
			this.text = this.text.slice(0, from) + insert + this.text.slice(to);
		}

		if (payload.selection) {
			const { anchor, head } = payload.selection;
			this.state.selection.main.anchor = anchor;
			this.state.selection.main.head = head;
			this.state.selection.ranges[0] = { from: anchor, to: head };
		}

		this.listener?.({
			docChanged: Boolean(payload.changes),
			selectionSet: Boolean(payload.selection),
			state: this.state,
		});
	}

	destroy() {
		this.destroyed = true;
	}
}

export const basicSetup = {};

export function resetCodeMirrorMock() {
	EditorView.instances.length = 0;
}
