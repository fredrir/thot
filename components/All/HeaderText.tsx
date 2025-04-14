
interface Props {
    className?: string
    children?: React.ReactNode
}


const HeaderText = ({className, children}: Props) => {


    return (
        <div className={`flex flex-col ${className}`}>
            <h2 className="text-3xl font-black uppercase text-stone-800 dark:text-stone-200">{children}</h2>
            <div className="h-2 w-16 bg-stone-800 dark:bg-stone-400 mt-2" />
          </div>
    );
};

export default HeaderText;