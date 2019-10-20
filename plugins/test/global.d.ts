declare namespace G4 {
    type ModeInfo = {
        name: string
    }

    type ModeColors = {
        background: string,
        damage: string,

        foreground: string,
        obstacle1: string,
        obstacle2: string,

        cannon: string,
        bullet: string
    }

    interface Mode {
        getInfo(): ModeInfo;
        getThemeColors(): ModeColors;
    }

    class Sound {
        soundFile: string;

        play(loop?: boolean);
        stop();
    }

    type EventListener = (event) => void;
    type EventType = "bulletcreate" | "bulletcollide" | "bulletadvance" |
                     "levelprepare" | "levelready" |
                     "gamestart" | "gamereset" | "gamemodechange" | "gamenextlevel";

    class EventHandler {
        eventType: EventType;
        listener: EventListener;
    }

    interface PluginContext {
        registerMode(mode: Mode);
        registerSound(path: string): Promise<Sound>;

        addEventListener(eventType: EventType, listener: EventListener);
        removeEventListener(eventType: EventType, listener: EventListener);

        log(message: string);
        info(message: string);
        warn(message: string);
        error(message: string);
    }
}