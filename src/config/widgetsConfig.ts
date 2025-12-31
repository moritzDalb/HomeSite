// Zentrale Widget-Konfiguration pro Seite
// Jeder Slot kann 'weather', 'greeting' oder null enthalten. Weitere Widgets können hier ergänzt werden.
export type WidgetName = 'weather' | 'greeting' | null;

export interface PageWidgets {
    left: WidgetName;
    center: WidgetName;
    right: WidgetName;
}

const widgetsConfig: Record<string, PageWidgets> = {
    home: {
        left: 'weather',
        center: 'greeting',
        right: null,
    },
    coding: {
        left: "weather",
        center: 'greeting',
        right: null,
    },
};

export default widgetsConfig;

