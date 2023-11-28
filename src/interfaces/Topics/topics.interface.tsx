export interface ITopics {
    _id: string;
    topicName: string;
    topicImage: string;
    topicDescription: string;
    subtopicIds: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITopic {
    id: string;
    topicName: string;
    topicImage: string;
    topicDescription: string;
    subtopicIds: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}