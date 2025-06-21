import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { FC, useState } from 'react';
import FigmaEmbed from '../components/FigmaEmbed';
import DefaultSidebar from '../components/sidebars/dashboard-sidebar';
import NextPageButton from '../components/NextButton';

interface AddProjectProps {
  onContinue: (figmaLink: string) => void;
  onBackPressed: () => void;
  onHomePressed: () => void;
}

const AddProject: FC<AddProjectProps> = ({ onContinue, onBackPressed, onHomePressed }) => {
  const [figmaLink, setFigmaLink] = useState('');

  return (
    <main className='w-full h-screen flex bg-white '>   
      <DefaultSidebar onBackPressed={onBackPressed} onHomePressed={onHomePressed}/>
      <section className='flex flex-col w-full p-10 gap-5'>
        <div>
          <h1 className='text-3xl font-semibold text-accent'>Figma Preview</h1>

          <h2 className=' text-gray-500/70 w-full m'>
            To get started, we will need the url of your design, paste it below.
          </h2>
        </div>


        <Input 
          className='w-full h-14 border-2 
          border-accent/10 
          focus-visible:outline-none
          focus-visible:border-accent/60 
          focus-visible:ring-0
          transition-all'
          placeholder='Paste your Figma Design URL here...'
          onChange={(e) => setFigmaLink(e.target.value)}
        />

        <FigmaEmbed figmaLink={figmaLink} />
      </section>

      <NextPageButton 
        disabled={!figmaLink || figmaLink.length <= 0} 
        onClick={() => onContinue(figmaLink)} 
      />
    </main>
  );
};

export default AddProject;