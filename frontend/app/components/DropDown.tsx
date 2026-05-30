import { useEffect, useMemo, useState } from "react";
import { useFloating, autoUpdate } from "@floating-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DropDownProps = {
    items: string[];
    onChange: (values: string[]) => void;
    className?: string;
};

enum Direction {
    UP,
    DOWN,
}

export default function DropDown({
    items,
    className,
    onChange,
}: DropDownProps) {
    const [currentSearchValue, setCurrentSearchValue] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [chosenItems, setChosenItems] = useState<string[]>([]);
    const [focused, setFocused] = useState<boolean>(false);
    const { refs, floatingStyles } = useFloating({
        whileElementsMounted: autoUpdate,
    });

    const visibleItems = useMemo(() => {
        const visibleItems = items.filter(
            (item) =>
                item.toLowerCase().includes(currentSearchValue.toLowerCase()) &&
                !chosenItems.some((chosenItem) => chosenItem == item)
        );
        if (!visibleItems.some((item) => item == selectedItem)) {
            setSelectedItem(visibleItems.length > 0 ? visibleItems[0] : null);
        }
        return visibleItems;
    }, [currentSearchValue, items, chosenItems]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "ArrowUp") {
            e.preventDefault();
            handleMovement(Direction.UP);
        } else if (e.key == "ArrowDown") {
            e.preventDefault();
            handleMovement(Direction.DOWN);
        } else if (e.key == "Enter") {
            e.preventDefault();
            if (selectedItem) {
                setChosenItems((prev) => [...prev, selectedItem]);
                setCurrentSearchValue("");
            }
        } else if (
            e.key == "Backspace" &&
            e.currentTarget.selectionStart == 0 &&
            e.currentTarget.selectionEnd == 0
        ) {
            e.preventDefault();
            setChosenItems((prev) => prev.slice(0, prev.length - 1));
        }
    };

    const handleMovement = (direction: Direction) => {
        if (visibleItems.length > 0) {
            if (selectedItem == null) {
                setSelectedItem(visibleItems[0]);
            } else {
                const wrapIndex = (index: number, length: number) =>
                    ((index % length) + length) % length;
                const index = wrapIndex(
                    visibleItems.indexOf(selectedItem) +
                        (direction == Direction.UP ? -1 : 1),
                    visibleItems.length
                );
                setSelectedItem(visibleItems[index]);
            }
        }
    };

    useEffect(() => {
        onChange(chosenItems);
    }, [chosenItems]);

    return (
        <div className={className}>
            <div
                ref={refs.setReference}
                className="mx-6 p-1 flex gap-2 border border-red-500"
            >
                {chosenItems.map((item) => (
                    <button
                        key={item}
                        className="bg-gray-900 p-1"
                        onClick={() =>
                            setChosenItems((prev) =>
                                prev.filter((chosenItem) => chosenItem !== item)
                            )
                        }
                    >
                        {item}
                        <FontAwesomeIcon icon={["far", "circle-xmark"]} />
                    </button>
                ))}
                <input
                    type="text"
                    placeholder="Filter by provider"
                    value={currentSearchValue}
                    className="outline-none grow"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => setCurrentSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div
                style={floatingStyles}
                ref={refs.setFloating}
                className={focused ? "w-full box-border m-2 bg-gray-500" : ""}
            >
                {focused &&
                    visibleItems.map((item) => (
                        <div
                            className={`p-1 ${item == selectedItem ? "bg-red-500" : ""}`}
                            key={item}
                            onMouseDown={() =>
                                setChosenItems([...chosenItems, item])
                            }
                        >
                            {item}
                        </div>
                    ))}
            </div>
        </div>
    );
}
