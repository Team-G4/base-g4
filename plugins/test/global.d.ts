declare namespace G4 {
    interface Score {
        mode: string;

        score: number;
        deathCount: number;

        userName: string;
    }

    interface Achievement {
        achievementId: string;
        mode: string;
    }

    interface User {
        userName: string;

        getScores(): Promise<Score[]>;
        getScore(mode: string): Promise<Score>;

        getAchievements(): Promise<Achievement[]>
    }

    type ModeInfo = {
        id: string,
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
        getCurrentUser(): User;

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