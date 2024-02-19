export type FPLTeam = {event_total: number, risen: number, 
    fallen: number, mostPoints: number, 
    leastPoints: number, last_rank: number, 
    rank_sort: number, entry: number
    entry_history: {bank: number, value: number, points_on_bench: number}
}

export const getEmptyFPLTeam = () => {
    return {
        event_total: 0,
        risen: 0,
        fallen: 0,
        mostPoints: 0,
        leastPoints: 0,
        last_rank: 0,
        rank_sort: 0,
        entry: 0,
        entry_history: {
            bank: 0,
            value: 0,
            points_on_bench: 0
        }
    }
}