import { Tab } from "@headlessui/react"
import { Fragment } from "react"
import Contributions from "../application/data/Contributions"

const product = {
    name: 'Application UI Icon Pack',
    version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
    price: '$220',
    description:
      'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
    highlights: [
      '200+ SVG icons in 3 unique styles',
      'Compatible with Figma, Sketch, and Adobe XD',
      'Drawn on 24 x 24 pixel grid',
    ],
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg',
    imageAlt: 'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
  }
  
  const license = {
    href: '#',
    summary:
      'For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.',
    content: `
      <h4>Overview</h4>
      
      <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
      
      <ul role="list">
      <li>You\'re allowed to use the icons in unlimited projects.</li>
      <li>Attribution is not required to use the icons.</li>
      </ul>
      
      <h4>What you can do with it</h4>
      
      <ul role="list">
      <li>Use them freely in your personal and professional work.</li>
      <li>Make them your own. Change the colors to suit your project or brand.</li>
      </ul>
      
      <h4>What you can\'t do with it</h4>
      
      <ul role="list">
      <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
      <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
      </ul>
    `,
  }
  
  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
const reviews = {
    average: 4,
    featured: [
      {
        id: 1,
        rating: 5,
        content: `
          <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
        `,
        date: 'July 16, 2021',
        datetime: '2021-07-16',
        author: 'Emily Selman',
        avatarSrc:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
      },
      {
        id: 2,
        rating: 5,
        content: `
          <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
        `,
        date: 'July 12, 2021',
        datetime: '2021-07-12',
        author: 'Hector Gibbons',
        avatarSrc:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
      },
      // More reviews...
    ],
  }
  const faqs = [
    {
      question: 'What format are these icons?',
      answer:
        'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
    },
    {
      question: 'Can I use the icons at different sizes?',
      answer:
        "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
    },
    // More FAQs...
  ]

export default function ProductDetailTab({tokenID}) {
  return (
    <Tab.Group as="div">
    <div className="border-b border-gray-200">
      <Tab.List className="-mb-px flex space-x-8">
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
          Data Contributors
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
            Computation Overview
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              selected
                ? 'border-cf-600 text-cf-600'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800',
              'whitespace-nowrap border-b-2 py-6 text-sm font-medium'
            )
          }
        >
          Token Holders
        </Tab>
      </Tab.List>
    </div>
    <Tab.Panels as={Fragment} >
      <Tab.Panel className="-mb-10 bg-white rounded-lg mt-5 max-h-[500px] overflow-auto" >
        <h3 className="sr-only">Contributors</h3>
        <Contributions tokenID={tokenID} />
      </Tab.Panel>  
    <Tab.Panel className="pt-10">
      <h3 className="sr-only">Computation Overview</h3>
      <div className="prose prose-sm max-w-none text-gray-500">
        Search for added CID to Job IDS
      </div>
    </Tab.Panel>
      <Tab.Panel className="pt-10">
        <h3 className="sr-only">Token Holders</h3>
        
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
  )
}
