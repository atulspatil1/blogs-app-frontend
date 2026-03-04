import { useReadingProgress } from '../hooks/useApi';

export function ReadingProgress() {

    const progress = useReadingProgress();
    
    return (
        <div
            className='reading-progress'
            style={{ width: `${progress}%` }}
            role='progressbar'
            aria-valuenow={ Math.round(progress) }
            aria-valuemin={ 0 }
            aria-valuemax={ 100 }        
        />
    );
}