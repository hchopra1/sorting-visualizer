import { useRef, useState } from 'react'

function SortingVisualizer() {
    const [numbers, setNumbers] = useState([40, 15, 70, 25, 55, 35, 65, 20])
    const [isSorting, setIsSorting] = useState(false)
    const [activeIndexes, setActiveIndexes] = useState([])
    const [algorithm, setAlgorithm] = useState('bubble')
    const [speed, setSpeed] = useState(500)
    const [comparisons, setComparisons] = useState(0)
    const [swaps, setSwaps] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Used to stop an algorithm while it is running
    const stopSorting = useRef(false)
    const pauseSorting = useRef(false)

    function shouldStopSorting() {
        if (stopSorting.current) {
            setIsSorting(false)
            setActiveIndexes([])
            return true
        }

        return false
    }

    async function waitWhilePaused() {
        while (pauseSorting.current) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
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

                await waitWhilePaused()

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
        pauseSorting.current = false
        setIsPaused(false)
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

                await waitWhilePaused()

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
        pauseSorting.current = false
        setIsPaused(false)
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

                await waitWhilePaused()

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

    async function mergeSort() {
        stopSorting.current = false
        pauseSorting.current = false
        setIsPaused(false)
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        await mergeSortHelper(newNumbers, 0, newNumbers.length - 1)

        await waitWhilePaused()

        if (shouldStopSorting()) return

        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }     

    //helper for mergeSort
    async function mergeSortHelper(array, start, end) {
        if (start >= end) {
            return
        }

        const middle = Math.floor((start + end) / 2)

        await mergeSortHelper(array, start, middle)

        if (shouldStopSorting()) return

        await mergeSortHelper(array, middle + 1, end)

        if (shouldStopSorting()) return

        await merge(array, start, middle, end)
    }

    async function merge(array, start, middle, end) {
        const left = array.slice(start, middle + 1)
        const right = array.slice(middle + 1, end + 1)

        let i = 0
        let j = 0
        let k = start

        while (i < left.length && j < right.length) { 
            setActiveIndexes([start + i, middle + 1 + j])
            setComparisons(prev => prev + 1)

            if (left[i] <= right[j]) {
                if (array[k] !== left[i]) {
                    setSwaps(prev => prev + 1)
                }
                
                array[k] = left[i]
                i++
            } else {
                if (array[k] !== right[j]) {
                    setSwaps(prev => prev + 1)
                }

                array[k] = right[j]
                j++
            }

            setNumbers([...array])

            await new Promise(resolve => setTimeout(resolve, speed))

            if (shouldStopSorting()) return

            k++
        }

        while (i < left.length) {
            array[k] = left[i]
            setNumbers([...array])

            await new Promise(resolve => setTimeout(resolve, speed))

            await waitWhilePaused()

            if (shouldStopSorting()) return

            i++
            k++
        }

        while (j < right.length) {
            array[k] = right[j]
            setNumbers([...array])

            await new Promise(resolve => setTimeout(resolve, speed))

            if (shouldStopSorting()) return

            j++
            k++
        }
    }

    async function quickSort() {
        stopSorting.current = false
        pauseSorting.current = false
        setIsPaused(false)
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        await quickSortHelper(newNumbers, 0, newNumbers.length - 1)

        await waitWhilePaused()

        if (shouldStopSorting()) return

        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }

    async function quickSortHelper(array, low, high) {
        if (low >= high) {
            return
        }

        const pivotIndex = await partition(array, low, high)

        if (shouldStopSorting()) return

        await quickSortHelper(array, low, pivotIndex - 1)

        if (shouldStopSorting()) return

        await quickSortHelper(array, pivotIndex + 1, high)
    }

    async function partition(array, low, high) {
        const pivot = array[high]
        let i = low - 1

        for (let j = low; j < high; j++) {
            setActiveIndexes([j, high])
            setComparisons(prev => prev + 1)

            await new Promise(resolve => setTimeout(resolve, speed))

            await waitWhilePaused()

            if (shouldStopSorting()) return

            if (array[j] < pivot) {
                i++

                const temp = array[i]
                array[i] = array[j]
                array[j] = temp

                setNumbers([...array])
                setSwaps(prev => prev + 1)
            }
        }

        const temp = array[i + 1]
        array[i + 1] = array[high]
        array[high] = temp

        setNumbers([...array])
        setSwaps(prev => prev + 1)

        return i + 1
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
        if (algorithm === 'merge') {
            await mergeSort()
        }
        if (algorithm === 'quick') {
            await quickSort()
    }
    }

    function resetNumbers() {
        // Tells the currently running algorithm to stop
        stopSorting.current = true
        pauseSorting.current = false

        setIsPaused(false)

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
                        <option value="merge">Merge Sort</option>
                        <option value="quick">Quick Sort</option>
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
                            onClick={() => {
                                pauseSorting.current = !pauseSorting.current
                                setIsPaused(pauseSorting.current)
                            }}
                            disabled={!isSorting}
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>

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
                                : algorithm === 'insertion'
                                ? 'Insertion Sort'
                                : algorithm === 'merge'
                                ? 'Merge Sort'
                                : 'Quick Sort'
                            }
                        </h3>

                        <p>
                            {algorithm === 'bubble'
                                ? 'Repeatedly compares neighboring values and swaps them if they are in the wrong order.'
                                : algorithm === 'selection'
                                ? 'Repeatedly finds the smallest remaining value and moves it into the next sorted position.'
                                : algorithm === 'insertion'
                                ? 'Builds the sorted portion one value at a time by moving each value left until it reaches the correct position.'
                                : algorithm === 'merge'
                                ? 'Divides the array into smaller halves, sorts those halves, and then merges them back together in order.'
                                : 'Chooses a pivot, moves smaller values to one side and larger values to the other, then repeats the process on each side.'
                            }
                        </p>
                    </div>

                    <div className="runtime">
                        <h3>Runtime</h3>

                        <p>
                            <strong>Best:</strong>{' '}
                            {algorithm === 'bubble'
                                ? 'O(n)'
                                : algorithm === 'selection'
                                ? 'O(n²)'
                                : algorithm === 'insertion'
                                ? 'O(n)'
                                : algorithm === 'merge'
                                ? 'O(n log n)'
                                : 'O(n log n)'
                            }
                        </p>

                        <p>
                            <strong>Average:</strong>{' '}
                            {algorithm === 'merge' || algorithm === 'quick'
                                ? 'O(n log n)'
                                : 'O(n²)'
                            }
                        </p>

                        <p>
                            <strong>Worst:</strong>{' '}
                            {algorithm === 'quick'
                                ? 'O(n²)'
                                : algorithm === 'merge'
                                ? 'O(n log n)'
                                : 'O(n²)'
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