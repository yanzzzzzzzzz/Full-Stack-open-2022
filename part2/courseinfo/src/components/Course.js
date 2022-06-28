const Course = ({course}) =>{
    const total = course.parts.reduce((partialSum, a) => partialSum + a.exercises, 0);
    return(
        <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <h3>total of {total} exercises</h3>
        </div>
    )
}
const Header = ({name}) =>{
    return(
        <h2>{name}</h2>
    )
}
const Content = ({parts}) =>{
    return(
        <div>
        {parts.map((part) =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
        </div>
    )
}
const Part = ({ name, exercises }) => {
    return (
        <p>
            {name} {exercises}
        </p>
    )
}
export default Course;
