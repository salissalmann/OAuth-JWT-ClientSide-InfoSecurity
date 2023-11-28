import { useQuery } from 'react-query'
import { fetchCurriculumById } from '../../api/curriculumApi/index'

export const useFetchCurriculumById = (curriculumId: string) => {
    return useQuery(['curriculumById', curriculumId], () => fetchCurriculumById(curriculumId))
}
