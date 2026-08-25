import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TimerClock from "../components/TimerClock";

type TimerOptions = {
    expiryTimestamp: Date;
    onExpire: () => void;
    interval: number;
};

const mocks = vi.hoisted(() => ({
    post: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    setIsTimerRunning: vi.fn(),
    updateHabitCurrentValue: vi.fn(),
    timerValues: {
        seconds: 30,
        minutes: 15,
        hours: 0,
        days: 0,
    },
    lastTimerOptions: undefined as TimerOptions | undefined,
}));

vi.mock("@/utils/api", () => ({
    default: {
        post: mocks.post,
    },
}));

vi.mock("@/store/HabitProvider", () => ({
    useHabitData: () => ({
        updateHabitCurrentValue: mocks.updateHabitCurrentValue,
    }),
}));

vi.mock("react-timer-hook", () => ({
    useTimer: (options: TimerOptions) => {
        mocks.lastTimerOptions = options;

        return {
            ...mocks.timerValues,
            pause: mocks.pause,
            resume: mocks.resume,
        };
    },
}));

describe("TimerClock component", () => {
    const expiryTimestamp = new Date("2026-08-25T12:00:00.000Z");

    beforeEach(() => {
        vi.clearAllMocks();
        mocks.timerValues.seconds = 30;
        mocks.timerValues.minutes = 15;
        mocks.timerValues.hours = 0;
        mocks.timerValues.days = 0;
        mocks.lastTimerOptions = undefined;
        mocks.post.mockResolvedValue({ data: {} });
    });

    it("renders the habit name and current countdown", () => {
        render(
            <TimerClock
                expiryTimestamp={expiryTimestamp}
                setIsTimerRunning={mocks.setIsTimerRunning}
                habitName="Reading"
                habitId="habit-1"
                unitValue={60}
            />
        );

        expect(screen.getByRole("heading", { name: "Reading" })).toBeInTheDocument();
        expect(screen.getByText((_, element) => element?.textContent === "0:0:15:30")).toBeInTheDocument();
        expect(mocks.lastTimerOptions).toMatchObject({ expiryTimestamp, interval: 20 });
    });

    it("pauses and resumes the timer from the controls", () => {
        render(
            <TimerClock
                expiryTimestamp={expiryTimestamp}
                setIsTimerRunning={mocks.setIsTimerRunning}
                habitName="Reading"
                habitId="habit-1"
                unitValue={60}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Pause" }));
        fireEvent.click(screen.getByRole("button", { name: "Resume" }));

        expect(mocks.pause).toHaveBeenCalledTimes(1);
        expect(mocks.resume).toHaveBeenCalledTimes(1);
    });

    it("logs the elapsed session and stops running when stop is clicked", async () => {
        render(
            <TimerClock
                expiryTimestamp={expiryTimestamp}
                setIsTimerRunning={mocks.setIsTimerRunning}
                habitName="Reading"
                habitId="habit-1"
                unitValue={60}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Stop" }));

        expect(mocks.pause).toHaveBeenCalledTimes(1);
        expect(mocks.setIsTimerRunning).toHaveBeenCalledWith(false);
        expect(mocks.post).toHaveBeenCalledWith("/habit/logHabit/habit-1", { sessionValue: 45 });
        await waitFor(() => {
            expect(mocks.updateHabitCurrentValue).toHaveBeenCalledWith("habit-1", 45);
        });
    });

    it("logs the elapsed session when the timer expires", async () => {
        render(
            <TimerClock
                expiryTimestamp={expiryTimestamp}
                setIsTimerRunning={mocks.setIsTimerRunning}
                habitName="Reading"
                habitId="habit-1"
                unitValue={60}
            />
        );

        mocks.lastTimerOptions?.onExpire();

        expect(mocks.setIsTimerRunning).toHaveBeenCalledWith(false);
        expect(mocks.post).toHaveBeenCalledWith("/habit/logHabit/habit-1", { sessionValue: 45 });
        await waitFor(() => {
            expect(mocks.updateHabitCurrentValue).toHaveBeenCalledWith("habit-1", 45);
        });
    });

    it("does not update local habit state when no habit id is provided", async () => {
        render(
            <TimerClock
                expiryTimestamp={expiryTimestamp}
                setIsTimerRunning={mocks.setIsTimerRunning}
                habitName="Reading"
                unitValue={60}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Stop" }));

        expect(mocks.post).toHaveBeenCalledWith("/habit/logHabit/undefined", { sessionValue: 45 });
        await waitFor(() => {
            expect(mocks.post).toHaveBeenCalledTimes(1);
        });
        expect(mocks.updateHabitCurrentValue).not.toHaveBeenCalled();
    });
});
