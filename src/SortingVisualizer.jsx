import {useState} from 'react'

function SortingVisualizer() {
    
    const [numbers, setNumbers] = useState([40, 15, 70, 25, 55])
    const [isSorting, setIsSorting] = useState(false)
    const [activeIndexes, setActiveIndexes] = useState([])
    
    async function sortNumbers() {
        setIsSorting(true)
        const newNumbers = [...numbers]

        for (let j = 0; j < newNumbers.length - 1; j++) {
            let swapped = false
            
            for (let i = 0; i < newNumbers.length - 1 - j; i++) {
                setActiveIndexes([i, i + 1])
                if (newNumbers[i] > newNumbers[i + 1]) {
                    const temp = newNumbers[i]
                    newNumbers[i] = newNumbers[i + 1]
                    newNumbers[i + 1] = temp

                    swapped = true
                    setNumbers([...newNumbers])
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

    function resetNumbers() {
        const randomNumbers = Array.from({ length: 5 }, () =>
            Math.floor(Math.random() * 61) + 20
        )

        setNumbers(randomNumbers)
        setActiveIndexes([])
    }

    return (
        <section className = "sorting-visualizer">
            <h1>Sorting Visualizer</h1>

            <button onClick={sortNumbers} disabled={isSorting}>
                {isSorting ? 'Sorting...' : 'Sort'}
            </button>

            <button onClick={resetNumbers} disabled={isSorting}>
                Reset
            </button>

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