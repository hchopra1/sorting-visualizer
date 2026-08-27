import { useRef, useState } from 'react'

function SortingVisualizer() {
    const [numbers, setNumbers] = useState([40, 15, 70, 25, 55, 35, 65, 20])
    const [isSorting, setIsSorting] = useState(false)
    const [activeIndexes, setActiveIndexes] = useState([])
    const [algorithm, setAlgorithm] = useState('bubble')
    const [speed, setSpeed] = useState(500)
    const [comparisons, setComparisons] = useState(0)
    const [swaps, setSwaps] = useState(0)

    // Used to stop an algorithm while it is running
    const stopSorting = useRef(false)

    function shouldStopSorting() {
        if (stopSorting.current) {
            setIsSorting(false)
            setActiveIndexes([])
            return true
        }

        return false
    }

    async function bubbleSort() {
        stopSorting.current = false
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        for (let j = 0; j < newNumbers.length - 1; j++) {
            let swapped = false

            for (let i = 0; i < newNumbers.length - 1 - j; i++) {
                setActiveIndexes([i, i + 1])
                setComparisons(prev => prev + 1)

                await new Promise(resolve => setTimeout(resolve, speed))

                if (shouldStopSorting()) return

                if (newNumbers[i] > newNumbers[i + 1]) {
                    const temp = newNumbers[i]
                    newNumbers[i] = newNumbers[i + 1]
                    newNumbers[i + 1] = temp

                    swapped = true

                    setNumbers([...newNumbers])
                    setSwaps(prev => prev + 1)
                }
            }

            // Stops early if the array is already sorted
            if (!swapped) {
                break
            }
        }

        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }

    async function selectionSort() {
        stopSorting.current = false
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        for (let i = 0; i < newNumbers.length - 1; i++) {
            let smallestIndex = i

            for (let j = i + 1; j < newNumbers.length; j++) {
                setActiveIndexes([smallestIndex, j])
                setComparisons(prev => prev + 1)

                await new Promise(resolve => setTimeout(resolve, speed))

                if (shouldStopSorting()) return

                if (newNumbers[j] < newNumbers[smallestIndex]) {
                    smallestIndex = j
                }
            }

            if (smallestIndex !== i) {
                const temp = newNumbers[i]
                newNumbers[i] = newNumbers[smallestIndex]
                newNumbers[smallestIndex] = temp

                setNumbers([...newNumbers])
                setSwaps(prev => prev + 1)
            }
        }

        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }

    async function insertionSort() {
        stopSorting.current = false
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        for (let i = 1; i < newNumbers.length; i++) {
            let j = i

            while (j > 0) {
                setActiveIndexes([j - 1, j])
                setComparisons(prev => prev + 1)

                await new Promise(resolve => setTimeout(resolve, speed))

                if (shouldStopSorting()) return

                if (newNumbers[j] < newNumbers[j - 1]) {
                    const temp = newNumbers[j]
                    newNumbers[j] = newNumbers[j - 1]
                    newNumbers[j - 1] = temp

                    setNumbers([...newNumbers])
                    setSwaps(prev => prev + 1)

                    j--
                } else {
                    break
                }
            }
        }

        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }

    // Runs whichever algorithm is selected
    async function sortNumbers() {
        if (algorithm === 'bubble') {
            await bubbleSort()
        }

        if (algorithm === 'selection') {
            await selectionSort()
        }

        if (algorithm === 'insertion') {
            await insertionSort()
        }
    }

    function resetNumbers() {
        // Tells the currently running algorithm to stop
        stopSorting.current = true

        const randomNumbers = Array.from(
            { length: 8 },
            () => Math.floor(Math.random() * 61) + 20
        )

        setNumbers(randomNumbers)
        setActiveIndexes([])
        setComparisons(0)
        setSwaps(0)
        setIsSorting(false)
    }

    return (
        <section className="sorting-visualizer">
            <h1>Sorting Visualizer</h1>

            <div className="visualizer-layout">
                <div className="visualizer-controls">
                    <select
                        value={algorithm}
                        onChange={(event) => setAlgorithm(event.target.value)}
                        disabled={isSorting}
                    >
                        <option value="bubble">Bubble Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="insertion">Insertion Sort</option>
                    </select>

                    <select
                        value={speed}
                        onChange={(event) => setSpeed(Number(event.target.value))}
                        disabled={isSorting}
                    >
                        <option value={800}>Slow</option>
                        <option value={500}>Medium</option>
                        <option value={200}>Fast</option>
                    </select>

                    <div className="control-buttons">
                        <button
                            onClick={sortNumbers}
                            disabled={isSorting}
                        >
                            {isSorting ? 'Sorting...' : 'Sort'}
                        </button>

                        <button onClick={resetNumbers}>
                            Reset
                        </button>
                    </div>

                    <div className="sorting-stats">
                        <p>Comparisons: {comparisons}</p>
                        <p>Swaps: {swaps}</p>
                    </div>

                    <div className="algorithm-description">
                        <h3>
                            {algorithm === 'bubble'
                                ? 'Bubble Sort'
                                : algorithm === 'selection'
                                ? 'Selection Sort'
                                : 'Insertion Sort'
                            }
                        </h3>

                        <p>
                            {algorithm === 'bubble'
                                ? 'Repeatedly compares neighboring values and swaps them if they are in the wrong order.'
                                : algorithm === 'selection'
                                ? 'Repeatedly finds the smallest remaining value and moves it into the next sorted position.'
                                : 'Builds the sorted portion one value at a time by moving each value left until it reaches the correct position.'
                            }
                        </p>
                    </div>
                </div>

                <div className="visualizer-bars">
                    <div className="bars">
                        {numbers.map((number, index) => (
                            <div
                                className="bar-container"
                                key={index}
                            >
                                <div
                                    style={{
                                        height: `${number * 3}px`
                                    }}
                                    className={`bar ${
                                        activeIndexes.includes(index)
                                            ? 'active-bar'
                                            : ''
                                    }`}
                                ></div>

                                <p>{number}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SortingVisualizer