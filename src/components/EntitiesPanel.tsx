import { Tag, DollarSign, Calendar, MapPin } from 'lucide-react';

interface Entity {
  type: string;
  value: string;
  confidence: number;
}

interface EntitiesPanelProps {
  entities: Entity[];
}

export default function EntitiesPanel({ entities }: EntitiesPanelProps) {
  const getEntityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AMOUNT':
        return <DollarSign className="w-4 h-4" />;
      case 'DATE':
        return <Calendar className="w-4 h-4" />;
      case 'JURISDICTION':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AMOUNT':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DATE':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'JURISDICTION':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'EQUITY':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const groupedEntities = entities.reduce((acc, entity) => {
    if (!acc[entity.type]) {
      acc[entity.type] = [];
    }
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-violet-600 p-2 rounded-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Extracted Entities</h3>
            <p className="text-sm text-slate-600">{entities.length} entities found</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {entities.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
              <Tag className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">No entities extracted</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntities).map(([type, typeEntities]) => (
              <div key={type}>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                  {type}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeEntities.map((entity, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getEntityColor(
                        entity.type
                      )}`}
                    >
                      {getEntityIcon(entity.type)}
                      <span className="text-sm font-medium">{entity.value}</span>
                      <span className="text-xs opacity-75">
                        {(entity.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
