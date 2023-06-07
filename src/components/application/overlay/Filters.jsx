import { getAllCategories } from '@/hooks/useTableland'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import Toggle from '../Toggle'

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Filters({name, selectChange, currentFilters}) {
    const [categories, setCategories] = useState([]);
    const [onlyOpen, setOnlyOpen] = useState(false);
    const [filters, setFilters] = useState(currentFilters);
    

    const handleOpenChange = (isOpen) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        open: isOpen,
      }));
    };
    
    const handleCategoryChange = (category) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categories: [...prevFilters.categories, category],
      }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const cat = await getAllCategories()
            setCategories(cat)
            }
        
        fetchCategories();
    }, []);
    
    const applyFilters = () => {
        selectChange(filters);
    };
    
    
  return (
    <div className="">

      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="grid items-center border border-gray-200 my-8 bg-white rounded-md"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group flex items-center font-medium text-gray-700">
                <FunnelIcon
                  className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {filters.categories.length} Filters
              </Disclosure.Button>
            </div>
            <div className="pl-6">
            <button type="button" className="text-cf-500 font-bold mr-5" onClick={applyFilters}>
              Apply Filters
            </button>
              <button type="button" className="text-gray-500" onClick={() => setFilters({open: false, categories:[]})}>
                Clear all
              </button>
              
            </div>
            <div className='pl-6'>
            <Toggle text="Open Datasets" status={filters.open} changeStatus={handleOpenChange}  />
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 py-6">
        <legend className="block font-medium ml-6">Category</legend> 
            <div className="grid  grid-cols-4  md:grid-cols-4 md:gap-x-6 px-6 ">
                  {categories.map((option, optionIdx) => (
                    <div key={option.value} className="col-span-1 flex items-center text-base sm:text-sm">
                      <input
                        id={`category-${optionIdx}`}
                        name="category[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-cf-600 focus:ring-cf-500"
                        defaultChecked={option.checked}
                        onChange={() => handleCategoryChange(option.value)}
                      />
                      <label htmlFor={`category-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
            </div>
        </Disclosure.Panel>
        <div className="col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Disclosure>
    </div>
  )
}
