import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Timer from "../pages/Timer";

type TestState = {
    user: {
        currentUser: { id: string } | null;
    };
};

type Selector = (state: TestState) => unknown;

const mocks = vi.hoisted(() => ({
    fetchHabitData: vi.fn(),
    navigate: vi.fn(),
    useHabitData: vi.fn(),
    useSelector: vi.fn(),
    params: { habitId: "habit-1" },
}));

vi.mock("react-redux", () => ({
    useSelector: mocks.useSelector,
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mocks.navigate,
    useParams: () => mocks.params,
}));

vi.mock("@/store/HabitProvider", () => ({
    useHabitData: mocks.useHabitData,
}));

vi.mock("@/components/TimerClock", () => ({
    default: ({ habitName, unitValue, habitId }: { habitName?: string; unitValue: number; habitId?: string }) => (
        <div data-testid="timer-clock">
            {habitName}-{unitValue}-{habitId}
        </div>
    ),
}));

describe("Timer page tests", () => {
    const habitData = [
        {
            id: "habit-1",
            name: "Reading",
            unitValue: 30,
            currentValue: 10,
        },
    ];

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        mocks.params.habitId = "habit-1";
        mocks.useSelector.mockImplementation((selector: Selector) => selector({ user: { currentUser: { id: "user-1" } } }));
        mocks.useHabitData.mockReturnValue({
            habitData,
            fetchHabitData: mocks.fetchHabitData,
        });
        vi.spyOn(window, "alert").mockImplementation(() => undefined);
    });

    it("renders the timer setup for a signed-in user", () => {
        render(<Timer />);

        expect(screen.getByRole("heading", { name: "Timer" })).toBeInTheDocument();
        expect(screen.getByText("select your duration for this session")).toBeInTheDocument();
        expect(screen.getByRole("spinbutton")).toHaveValue(20);
        expect(mocks.fetchHabitData).toHaveBeenCalled();
    });

    it("renders nothing when there is no signed-in user", () => {
        mocks.useSelector.mockImplementation((selector: Selector) => selector({ user: { currentUser: null } }));

        const { container } = render(<Timer />);

        expect(container).toBeEmptyDOMElement();
    });

    it("navigates back when cancel is clicked", () => {
        render(<Timer />);

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mocks.navigate).toHaveBeenCalledWith(-1);
    });

    it("shows an alert when the selected duration exceeds the habit target", () => {
        render(<Timer />);

        fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "31" } });
        fireEvent.click(screen.getByRole("button", { name: "Start Session" }));

        expect(window.alert).toHaveBeenCalledWith("value exceeded");
        expect(screen.queryByTestId("timer-clock")).not.toBeInTheDocument();
    });

    it("starts the timer with the selected duration", () => {
        render(<Timer />);

        fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "15" } });
        fireEvent.click(screen.getByRole("button", { name: "Start Session" }));

        expect(screen.getByTestId("timer-clock")).toHaveTextContent("Reading-15-habit-1");
    });
})
