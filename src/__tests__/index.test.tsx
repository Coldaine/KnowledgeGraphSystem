import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('@/components/GraphView/GraphView');

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getByText('Knowledge Graph')).toBeInTheDocument();
  });

  it('renders the view mode buttons', () => {
    render(<Home />);
    expect(screen.getByTitle('Graph View (gg)')).toBeInTheDocument();
    expect(screen.getByTitle('Document View (gd)')).toBeInTheDocument();
    expect(screen.getByTitle('Brainstorm Mode (gb)')).toBeInTheDocument();
    expect(screen.getByTitle('Folder View (gf)')).toBeInTheDocument();
  });

  it('renders the block and edge counts', () => {
    render(<Home />);
    expect(screen.getByText(/blocks/)).toBeInTheDocument();
    expect(screen.getByText(/edges/)).toBeInTheDocument();
  });

  it('renders the keyboard shortcuts HUD', () => {
    render(<Home />);
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
  });
});
