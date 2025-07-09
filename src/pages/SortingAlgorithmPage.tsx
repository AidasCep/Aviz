import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import "./SortingRender.css";
import { GetBubbleSortAnimations,
     GetSelectionSortAnimations,
      GetInsertionSortAnimations,
       GetQuickSortAnimations,
        GetMergeSortAnimations,
         GetHeapSortAnimations,
          GetGnomeSortAnimations }
 from '../Algorithms/SortingAlgorithms';

const PRIMARY_COLOR = 'rgb(59, 57, 182)';
const SECONDARY_COLOR = 'red';


const SortingAlgorithmPage: React.FC = () => {
    const [array, setArray] = useState<number[]>([]);
    const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);
    const [animationSpeed, setAnimationSpeed] = useState<number>(20);
    const [sortingInProgress, setSortingInProgress] = useState<boolean>(false);
    const [sortingFinished, setSortingFinished] = useState<boolean>(false);
    const [arraySize, setArraySize] = useState<number>(50);

    const animationSpeedRef = useRef<HTMLInputElement>(null);
    const arraySizeRef = useRef<HTMLInputElement>(null);
    const stopAnimationRef = useRef<boolean>(false);

    const clearTimeouts = useCallback(() => {
        timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        setTimeouts([]);
    }, [timeouts]);

    const resetArray = useCallback(() => {
        stopAnimationRef.current = true;
        clearTimeouts();
        setSortingFinished(false);
        
        const newArr: number[] = [];
        for (let i = 0; i < arraySize; i++) {
            let a = Math.floor(Math.random() * 700);
            while (a < 10) {
                a = Math.floor(Math.random() * 700);
            }
            newArr.push(a);
        }

        setArray(newArr);
        setTimeouts([]);
        setSortingInProgress(false);
        
        setTimeout(() => {
            const arrayBars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
            let width = Math.floor(1000 / arraySize) + 'px';
            for (let i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
                arrayBars[i].style.height = `${newArr[i]}px`; 
                arrayBars[i].style.width = width;
            }
        }, 0);
    }, [arraySize, clearTimeouts]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseInt(event.target.value, 10);
        setAnimationSpeed(newSpeed);
    };

    const handleArraySizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setArraySize(newSize);
    };

    const sort = useCallback(async (GetSort: (array: number[]) => { type: string, indices: number[], values?: number[] }[]) => {
        if (sortingInProgress || sortingFinished) { 
            resetArray(); 
            return; 
        }
        
        setSortingInProgress(true);
        stopAnimationRef.current = false; 
        clearTimeouts();
        
        const animations = GetSort(array.slice());         
        
        const arrayBars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
        let index = 0; 
    
        const animate = () => {
            if (stopAnimationRef.current || index >= animations.length) {
                setSortingInProgress(false);
                setSortingFinished(true);
                return;
            }
    
            const currentSpeed = 100 - parseInt(animationSpeedRef.current?.value || "50");
            
            let steps = currentSpeed < 20 ? 1 : Math.max(1, Math.floor(16.7 / currentSpeed));
            let processedSteps = 0;
            
            while (processedSteps < steps && index < animations.length) {
                const { type, indices, values } = animations[index];
                const [barOneIdx, barTwoIdx] = indices;
                
                if (type === 'compare') {
                    const barOneStyle = arrayBars[barOneIdx].style;
                    const barTwoStyle = arrayBars[barTwoIdx].style;
                    
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;

                    const highlightDuration = Math.max(currentSpeed, 10);
                    
                    const timeout1 = setTimeout(() => {
                        if (stopAnimationRef.current) return;
                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, highlightDuration);

                    setTimeouts(prevTimeouts => [...prevTimeouts, timeout1]);
    
                } else if (type === 'swap') {
                    const barOneStyle = arrayBars[barOneIdx].style;
                    const barTwoStyle = arrayBars[barTwoIdx].style;
                    
                    // For swaps, briefly highlight them
                    barOneStyle.backgroundColor = '#ff6b6b';
                    barTwoStyle.backgroundColor = '#ff6b6b';
                    
                    // Swap the heights
                    const tempHeight = barOneStyle.height;
                    barOneStyle.height = barTwoStyle.height;
                    barTwoStyle.height = tempHeight;
                    
                    // Reset color after a brief moment
                    const timeout2 = setTimeout(() => {
                        if (stopAnimationRef.current) return;
                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, Math.max(currentSpeed, 15));
                    
                    setTimeouts(prevTimeouts => [...prevTimeouts, timeout2]);
    
                } else if (type === 'overwrite') {
                    const barStyle = arrayBars[barOneIdx].style;
                    barStyle.backgroundColor = '#4ecdc4'; // Teal for overwrite
                    barStyle.height = `${values![0]}px`;
                    
                    // Reset color after brief highlight
                    const timeout3 = setTimeout(() => {
                        if (stopAnimationRef.current) return;
                        barStyle.backgroundColor = PRIMARY_COLOR;
                    }, Math.max(currentSpeed, 12));
                    
                    setTimeouts(prevTimeouts => [...prevTimeouts, timeout3]);
                }
    
                index++;
                processedSteps++;
            }
            
            const nextFrameDelay = currentSpeed < 10 ? 1 : Math.min(currentSpeed, 50);
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, nextFrameDelay);
        };
    
        requestAnimationFrame(animate);
    }, [sortingInProgress, sortingFinished, resetArray, clearTimeouts, array, animationSpeed]);

    useEffect(() => {
        resetArray();
    }, [arraySize]);

    useEffect(() => {
        resetArray();
    }, []);

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="slidecontainer">
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={animationSpeed} 
                        className="slider" 
                        id="myRange"
                        ref={animationSpeedRef} 
                        onChange={handleSliderChange} 
                    />
                    <p>Animation Speed: {animationSpeed}</p>
                    <input 
                        type="range" 
                        min="2" 
                        max="100" 
                        value={arraySize} 
                        className="slider" 
                        id="arrRange"
                        ref={arraySizeRef}
                        onChange={handleArraySizeChange}
                    />
                    <p>Array size: {arraySize} n</p>
                </div>
                <button onClick={resetArray}>Generate New Array</button>
                <button onClick={() => sort(GetBubbleSortAnimations)}>Bubble Sort</button>
                <button onClick={() => sort(GetSelectionSortAnimations)}>Selection Sort</button>
                <button onClick={() => sort(GetInsertionSortAnimations)}>Insertion Sort</button>
                <button onClick={() => sort(GetGnomeSortAnimations)}>Gnome Sort</button>
                <button onClick={() => sort(GetMergeSortAnimations)}>Merge Sort</button>
                <button onClick={() => sort(GetQuickSortAnimations)}>Quick Sort</button>
                <button onClick={() => sort(GetHeapSortAnimations)}>Heap Sort</button>
    
            </div>
            <div className="array-container">
                {array.map((value, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            height: `${value}px`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SortingAlgorithmPage;