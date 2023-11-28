import Banner from "../../components/UiComponents/Banner";



const ManageMcqQuestion = () => {
  //const { data, isLoading, isError, error } = useFetchAllMcqQuestions();
  //console.log(error, isError)
  return (
    <div className="w-full pb-20">
      <Banner
        category="Manage"
        heading="Mcq Questions"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum doloremque repellendus officia id recusandae, odit saepe quos! Autem, dolor! Temporibus!"
        link="#"
        isPicture={false}
      />

    </div>
  );
};

export default ManageMcqQuestion;
