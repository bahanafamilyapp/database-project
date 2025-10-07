import { useState, useRef, useEffect } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, ChevronRight, ChevronDown, X, User } from 'lucide-react';
import { familyTree, people, TreeNode } from '../data/mockData';

interface NodePosition {
  x: number;
  y: number;
  node: TreeNode;
}

export default function Silsilah() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3));
  const fitToScreen = () => {
    setScale(0.8);
    setPosition({ x: 50, y: 50 });
  };

  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => setCollapsedNodes(new Set());
  const collapseAll = () => {
    const allNodeIds = new Set<string>();
    const collectIds = (node: TreeNode) => {
      if (node.children && node.children.length > 0) {
        allNodeIds.add(node.id);
        node.children.forEach(collectIds);
      }
    };
    collectIds(familyTree);
    setCollapsedNodes(allNodeIds);
  };

  const getPersonDetails = (personId: string) => {
    return people.find(p => p.id === personId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.tree-canvas')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderNode = (node: TreeNode, level: number = 0, parentX: number = 0, parentY: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const nodeWidth = 220;
    const nodeHeight = 80;
    const horizontalGap = 100;
    const verticalGap = 100;

    const isCollapsed = collapsedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const person = getPersonDetails(node.personId);
    const spouse = node.spouse ? getPersonDetails(node.spouse.personId) : null;

    const x = level * (nodeWidth + horizontalGap);
    const y = parentY;

    const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());

    elements.push(
      <div
        key={node.id}
        className={`absolute transition-all duration-300 ${isHighlighted ? 'ring-4 ring-yellow-400' : ''}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${nodeWidth}px`,
        }}
      >
        <div className={`bg-white rounded-lg border-2 ${isHighlighted ? 'border-yellow-400' : 'border-[#E5E9F0]'} p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
             onClick={() => setSelectedPerson(node.personId)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-[#3562A7] p-2 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{node.name.split(' (')[0]}</p>
                <p className="text-xs text-[#6B7280]">{node.name.match(/\(([^)]+)\)/)?.[1]}</p>
              </div>
            </div>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(node.id);
                }}
                className="text-[#3562A7] hover:bg-[#F5F7FB] rounded p-1"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          {person && (
            <div className="text-xs text-[#6B7280] space-y-1">
              <p>{person.city}</p>
              <p className="font-medium text-[#3562A7]">{person.marga}</p>
            </div>
          )}
        </div>

        {spouse && (
          <div className="bg-white rounded-lg border-2 border-[#E5E9F0] p-3 shadow-lg mt-2">
            <div className="flex items-center gap-2">
              <div className="bg-pink-500 p-1.5 rounded-full">
                <User className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-xs">{spouse.name}</p>
                <p className="text-xs text-[#6B7280]">Pasangan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    if (hasChildren && !isCollapsed && node.children) {
      let childY = y;
      node.children.forEach((child, index) => {
        const childX = x + nodeWidth + horizontalGap;

        elements.push(
          <svg
            key={`line-${node.id}-${child.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${x + nodeWidth}px`,
              top: `${Math.min(y, childY)}px`,
              width: `${horizontalGap}px`,
              height: `${Math.abs(childY - y) + nodeHeight}px`,
            }}
          >
            <line
              x1="0"
              y1={y < childY ? nodeHeight / 2 : Math.abs(childY - y) + nodeHeight / 2}
              x2={horizontalGap / 2}
              y2={y < childY ? nodeHeight / 2 : Math.abs(childY - y) + nodeHeight / 2}
              stroke="#3562A7"
              strokeWidth="2"
            />
            <line
              x1={horizontalGap / 2}
              y1={y < childY ? nodeHeight / 2 : Math.abs(childY - y) + nodeHeight / 2}
              x2={horizontalGap / 2}
              y2={y < childY ? Math.abs(childY - y) + nodeHeight / 2 : nodeHeight / 2}
              stroke="#3562A7"
              strokeWidth="2"
            />
            <line
              x1={horizontalGap / 2}
              y1={y < childY ? Math.abs(childY - y) + nodeHeight / 2 : nodeHeight / 2}
              x2={horizontalGap}
              y2={y < childY ? Math.abs(childY - y) + nodeHeight / 2 : nodeHeight / 2}
              stroke="#3562A7"
              strokeWidth="2"
            />
          </svg>
        );

        elements.push(...renderNode(child, level + 1, childX, childY));
        childY += (nodeHeight + verticalGap);
      });
    }

    return elements;
  };

  const selectedPersonDetails = selectedPerson ? getPersonDetails(selectedPerson) : null;

  return (
    <div className="p-6 lg:p-8 space-y-6 h-[calc(100vh-2rem)]">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Silsilah Keluarga</h1>
        <p className="text-[#6B7280]">Visualisasi pohon keluarga interaktif</p>
      </div>

      <div className="bg-white rounded-[10px] p-4 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)] flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E9F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3562A7]"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={zoomOut}
            className="p-2 border border-[#E5E9F0] rounded-lg hover:bg-[#F5F7FB] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={zoomIn}
            className="p-2 border border-[#E5E9F0] rounded-lg hover:bg-[#F5F7FB] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-2 border border-[#E5E9F0] rounded-lg hover:bg-[#F5F7FB] transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={expandAll}
            className="px-3 py-2 border border-[#E5E9F0] rounded-lg hover:bg-[#F5F7FB] transition-colors text-sm font-medium"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 border border-[#E5E9F0] rounded-lg hover:bg-[#F5F7FB] transition-colors text-sm font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded-[10px] border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)] overflow-hidden relative"
        style={{ height: 'calc(100% - 180px)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="tree-canvas absolute"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            cursor: isDragging ? 'grabbing' : 'grab',
            minWidth: '200%',
            minHeight: '200%',
          }}
        >
          {renderNode(familyTree, 0, 0, 100)}
        </div>

        <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg border border-[#E5E9F0] shadow-lg text-sm text-[#6B7280]">
          Zoom: {Math.round(scale * 100)}%
        </div>
      </div>

      {selectedPersonDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-900">Detail Orang</h2>
              <button onClick={() => setSelectedPerson(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5E9F0]">
                <div className="bg-[#3562A7] p-3 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-lg">{selectedPersonDetails.name}</p>
                  <p className="text-sm text-[#6B7280]">{selectedPersonDetails.marga}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Jenis Kelamin</p>
                  <p className="font-medium text-gray-900">{selectedPersonDetails.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Tanggal Lahir</p>
                  <p className="font-medium text-gray-900">{selectedPersonDetails.dob}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Pendidikan</p>
                  <p className="font-medium text-gray-900">{selectedPersonDetails.education}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Kota</p>
                  <p className="font-medium text-gray-900">{selectedPersonDetails.city}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPerson(null)}
              className="w-full mt-6 px-4 py-2.5 bg-[#3562A7] text-white rounded-lg hover:bg-[#2a4d85] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
