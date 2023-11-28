export interface IUniversity {
    _id: string,
    universityName: string,
    universityDescription: string,
    universityImages: string[],
    universityLogo: string,
    acronym: string,
    parentUniversityId: string,
    academicYears: [
        {
            academicYear: string,
            curriculum: [
                {
                    moduleId: string,
                    disciplines: [
                        {
                            disciplineId: string,
                            topics: [
                                {
                                    topicId: string,
                                    subTopics: string[]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    createdAt: string,
    updatedAt: string
}