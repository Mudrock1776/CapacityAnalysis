import Link from "next/link";

const links = [
    {name: "Home", href: "/dashboard"},
    {name: "Parts", href: "/dashboard/parts"},
    {name: "Workstations", href: "/dashboard/workstations"},
    {name: "Processes", href: "/dashboard/processes"}
]

export default function NavBar(){
    return(
    <>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
                {links.map((link) => {
                    return(
                        <li key={link.name}>
                            <Link key={link.name} href={link.href} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <p>{link.name}</p>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    </>
    );
}