import { Extension } from "@tiptap/core";

const ParagraphIndent = Extension.create({
    name: "paragraphIndent",

    addGlobalAttributes() {
        return [
            {
                types: ["paragraph"],
                attributes: {
                    textIndent: {
                        default: null,

                        parseHTML: (element) =>
                            element.style.textIndent || null,

                        renderHTML: (attributes) => {
                            if (!attributes.textIndent) {
                                return {};
                            }

                            return {
                                style: `text-indent: ${attributes.textIndent}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addKeyboardShortcuts() {
        return {
            Tab: () =>
                this.editor.commands.updateAttributes("paragraph", {
                    textIndent: "2rem",
                }),

            "Shift-Tab": () =>
                this.editor.commands.updateAttributes("paragraph", {
                    textIndent: null,
                }),
        };
    },
});

export default ParagraphIndent;