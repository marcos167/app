'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDropzone } from 'react-dropzone';
import { GripVertical, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

interface Ingredient {
    id: string;
    name: string;
    quantity: string;
}

interface Step {
    id: string;
    description: string;
}

interface AdvancedRecipeEditorProps {
    initialIngredients?: Ingredient[];
    initialSteps?: Step[];
    initialImages?: string[];
    onSave?: (data: { ingredients: Ingredient[]; steps: Step[]; images: string[] }) => void;
}

export default function AdvancedRecipeEditor({
    initialIngredients = [],
    initialSteps = [],
    initialImages = [],
    onSave
}: AdvancedRecipeEditorProps) {
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        initialIngredients.length > 0 ? initialIngredients : [{ id: '1', name: '', quantity: '' }]
    );
    const [steps, setSteps] = useState<Step[]>(
        initialSteps.length > 0 ? initialSteps : [{ id: '1', description: '' }]
    );
    const [images, setImages] = useState<string[]>(initialImages);
    const [uploading, setUploading] = useState(false);

    // Auto-save functionality
    const handleAutoSave = () => {
        if (onSave) {
            onSave({ ingredients, steps, images });
        }
    };

    // Drag and drop handlers
    const handleIngredientDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(ingredients);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setIngredients(items);
        handleAutoSave();
    };

    const handleStepDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(steps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSteps(items);
        handleAutoSave();
    };

    // Ingredient handlers
    const addIngredient = () => {
        setIngredients([...ingredients, { id: Date.now().toString(), name: '', quantity: '' }]);
    };

    const removeIngredient = (id: string) => {
        setIngredients(ingredients.filter(ing => ing.id !== id));
        handleAutoSave();
    };

    const updateIngredient = (id: string, field: 'name' | 'quantity', value: string) => {
        setIngredients(ingredients.map(ing =>
            ing.id === id ? { ...ing, [field]: value } : ing
        ));
    };

    // Step handlers
    const addStep = () => {
        setSteps([...steps, { id: Date.now().toString(), description: '' }]);
    };

    const removeStep = (id: string) => {
        setSteps(steps.filter(step => step.id !== id));
        handleAutoSave();
    };

    const updateStep = (id: string, value: string) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, description: value } : step
        ));
    };

    // Image upload
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        multiple: true,
        onDrop: async (acceptedFiles) => {
            setUploading(true);
            try {
                const uploadPromises = acceptedFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const { url } = await res.json();
                    return url;
                });

                const urls = await Promise.all(uploadPromises);
                setImages([...images, ...urls]);
                handleAutoSave();
            } catch (err) {
                console.error('Upload failed:', err);
                alert('Erro ao fazer upload das imagens');
            } finally {
                setUploading(false);
            }
        }
    });

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        handleAutoSave();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Editor */}
            <div className="space-y-6">
                {/* Images Upload */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Imagens</h3>

                    {/* Upload Zone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-stone-700 hover:border-stone-600'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <ImageIcon size={48} className="mx-auto mb-3 text-stone-500" />
                        <p className="text-stone-400 text-sm">
                            {isDragActive
                                ? 'Solte as imagens aqui...'
                                : 'Arraste imagens ou clique para selecionar'}
                        </p>
                        {uploading && <p className="text-blue-400 text-xs mt-2">Fazendo upload...</p>}
                    </div>

                    {/* Image Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {images.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ingredients */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Ingredientes</h3>
                        <button
                            onClick={addIngredient}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold hover:bg-green-500/30 transition-colors"
                        >
                            <Plus size={16} />
                            Adicionar
                        </button>
                    </div>

                    <DragDropContext onDragEnd={handleIngredientDragEnd}>
                        <Droppable droppableId="ingredients">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {ingredients.map((ingredient, index) => (
                                        <Draggable key={ingredient.id} draggableId={ingredient.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="flex items-center gap-2 bg-[#252525] rounded-lg p-3"
                                                >
                                                    <div {...provided.dragHandleProps}>
                                                        <GripVertical size={16} className="text-stone-600" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Quantidade"
                                                        value={ingredient.quantity}
                                                        onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                                                        onBlur={handleAutoSave}
                                                        className="w-24 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2 py-1 text-sm text-white"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Ingrediente"
                                                        value={ingredient.name}
                                                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                                                        onBlur={handleAutoSave}
                                                        className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2 py-1 text-sm text-white"
                                                    />
                                                    <button
                                                        onClick={() => removeIngredient(ingredient.id)}
                                                        className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Steps */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Modo de Preparo</h3>
                        <button
                            onClick={addStep}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition-colors"
                        >
                            <Plus size={16} />
                            Adicionar Passo
                        </button>
                    </div>

                    <DragDropContext onDragEnd={handleStepDragEnd}>
                        <Droppable droppableId="steps">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {steps.map((step, index) => (
                                        <Draggable key={step.id} draggableId={step.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="flex items-start gap-2 bg-[#252525] rounded-lg p-3"
                                                >
                                                    <div {...provided.dragHandleProps} className="mt-2">
                                                        <GripVertical size={16} className="text-stone-600" />
                                                    </div>
                                                    <span className="text-stone-500 font-bold text-sm mt-2">{index + 1}.</span>
                                                    <textarea
                                                        placeholder="Descreva o passo..."
                                                        value={step.description}
                                                        onChange={(e) => updateStep(step.id, e.target.value)}
                                                        onBlur={handleAutoSave}
                                                        className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white resize-none"
                                                        rows={3}
                                                    />
                                                    <button
                                                        onClick={() => removeStep(step.id)}
                                                        className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors mt-2"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="sticky top-20 h-fit">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📱 Preview</h3>

                    {/* Preview Content */}
                    <div className="bg-[#0C0A09] rounded-xl p-4 space-y-4">
                        {/* Images Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Ingredients Preview */}
                        {ingredients.some(i => i.name) && (
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2">Ingredientes:</h4>
                                <ul className="space-y-1">
                                    {ingredients.filter(i => i.name).map((ingredient, index) => (
                                        <li key={index} className="text-xs text-stone-400">
                                            • {ingredient.quantity} {ingredient.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Steps Preview */}
                        {steps.some(s => s.description) && (
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2">Modo de Preparo:</h4>
                                <ol className="space-y-2">
                                    {steps.filter(s => s.description).map((step, index) => (
                                        <li key={index} className="text-xs text-stone-400">
                                            <span className="font-bold text-white">{index + 1}.</span> {step.description}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {images.length === 0 && !ingredients.some(i => i.name) && !steps.some(s => s.description) && (
                            <p className="text-center text-stone-600 text-sm py-8">
                                Comece a adicionar conteúdo para ver o preview
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-stone-600 mt-4 text-center">
                        💾 Auto-save ativado
                    </p>
                </div>
            </div>
        </div>
    );
}
