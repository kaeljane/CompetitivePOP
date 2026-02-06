import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableNotebookCard({ notebook, onClick }: any) {
  // Hook que dá os poderes de arrastar
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: notebook.id });

  // Estilo para o movimento ser suave
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab', // Mãozinha para indicar que pode pegar
    touchAction: 'none' // Importante para funcionar em celular
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="notebook-card" // Mantendo sua classe original de CSS
      onClick={onClick}
    >
      <h4 className="notebook-title">{notebook.title}</h4>
      <p className="notebook-desc">{notebook.description || 'Sem descrição'}</p>
      
      <div style={{display: 'flex', gap: '10px', marginTop: '10px', fontSize: '0.85rem'}}>
        <span className="notebook-count">
          {notebook.problems ? notebook.problems.length : 0} questões
        </span>
        {notebook.problems && notebook.problems.some((p:any) => p.solved) && (
          <span style={{color: 'green', fontWeight: 'bold'}}>
            ✅ {notebook.problems.filter((p:any) => p.solved).length} feitas
          </span>
        )}
      </div>
    </div>
  );
}