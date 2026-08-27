import {useState} from 'react'

function SortingVisualizer() {
    
    const [numbers, setNumbers] = useState([40, 15, 70, 25, 55, 35, 65, 20])
    const [isSorting, setIsSorting] = useState(false)
    const [activeIndexes, setActiveIndexes] = useState([])
    const [algorithm, setAlgorithm] = useState('bubble')
    const[speed, setSpeed] = useState(500)
    const [comparisons, setComparisons] = useState(0)
    const [swaps, setSwaps] = useState(0)
    
    async function bubbleSort() {
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers = [...numbers]

        for (let j = 0; j < newNumbers.length - 1; j++) {
            let swapped = false
            
            for (let i = 0; i < newNumbers.length - 1 - j; i++) {
                setActiveIndexes([i, i + 1])
                setComparisons(prev => prev + 1)

                if (newNumbers[i] > newNumbers[i + 1]) {
                    const temp = newNumbers[i]
                    newNumbers[i] = newNumbers[i + 1]
                    newNumbers[i + 1] = temp

                    swapped = true
                    setNumbers([...newNumbers])
                    setSwaps(prev => prev + 1)
                }
                await new Promise(resolve => setTimeout(resolve, 500))
            }

            if (!swapped) {
                break
            }
        }
        setNumbers(newNumbers)
        setIsSorting(false)
        setActiveIndexes([])
    }

    async function selectionSort() {
        setIsSorting(true)
        setComparisons(0)
        setSwaps(0)

        const newNumbers=[...numbers]

        for (let i = 0; i < newNumbers.length - 1; i++) {
            let smallestIndex = i

            for (let j = i + 1; j < newNumbers.length; j++) {
                setActiveIndexes([smallestIndex, j])
                setComparisons(prev => prev + 1)

                await new Promise(resolve => setTimeout(resolve, 500))

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

    async function sortNumbers() {
        if (algorithm === 'bubble') {
            await bubbleSort()
        }

        if (algorithm === 'selection') {
            await selectionSort()
        }
    }

    function resetNumbers() {
        const randomNumbers = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 61) + 20
        )

        setNumbers(randomNumbers)
        setActiveIndexes([])
        setComparisons(0)
    }

    return (
        <section className = "sorting-visualizer">
            <h1>Sorting Visualizer</h1>

            <select
                value={algorithm}
                onChange={(event) => setAlgorithm(event.target.value)}
                disabled={isSorting}
            >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
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

            <button onClick={sortNumbers} disabled={isSorting}>
                {isSorting ? 'Sorting...' : 'Sort'}
            </button>

            <button onClick={resetNumbers} disabled={isSorting}>
                Reset
            </button>

            <p>Comparisons: {comparisons}</p>
            <p>Swaps: {swaps}</p>
            

            <div className="bars">
                {numbers.map((number, index) => (
                    <div className="bar-container" key={index}>
                        <div 
                        style={{ height: `${number * 3}px` }} 
                        className={`bar ${activeIndexes.includes(index) ? 'active-bar' : ''}`}>
                        </div>
                        <p>{number}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SortingVisualizer