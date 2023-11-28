// import { useState } from "react";
import Banner from "../../components/UiComponents/Banner";
// interface IMcqQuestion {
//   questionText: string;
//   body: object;
//   tip: string;
//   hintText: string[];
//   questionImage: string;
//   questionType:string;
//   referencePdfLink:object[];
//   options:object[];
//   questionSource:

// }
const AddMcqQuestion = () => {
//   const [formData, setFormData] = useState<IMcqQuestion>({
//     questionText: "",
//     body: {},
//     tip: "",
//     hintText: [],
//     questionImage: "",
//   });
  return (
    <div className="w-full pb-20">
      <Banner
        category="Create"
        heading="Add Mcq Question"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum doloremque repellendus officia id recusandae, odit saepe quos! Autem, dolor! Temporibus!"
        link="#"
        isPicture={false}
      />
    </div>
  );
};

export default AddMcqQuestion;
