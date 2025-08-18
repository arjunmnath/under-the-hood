"use client";

import { LogEntry } from "@/types/log";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Info,
  AlertTriangle,
  XCircle,
  Bug,
  Code,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogCardProps {
  log: LogEntry;
}

const logLevelConfig = {
  info: {
    icon: Info,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-400/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-400/30",
  },
  error: {
    icon: XCircle,
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    badgeColor: "bg-red-500/10 text-red-400 border-red-400/30",
  },
  debug: {
    icon: Bug,
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    badgeColor: "bg-gray-500/10 text-gray-400 border-gray-400/30",
  },
};

export default function LogCard({ log }: LogCardProps) {
  const config = logLevelConfig[log.level];
  const IconComponent = config.icon;

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Unknown time";

    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid timestamp";
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg border-l-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70",
        config.color,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <IconComponent className="w-5 h-5 text-current" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", config.badgeColor)}
                >
                  {log.level.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-500/10 text-purple-400 border-purple-400/30"
                >
                  {log.application}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-green-500/10 text-green-400 border-green-400/30"
                >
                  {log.logger}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed break-words">
                {log.message}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>User: {log.userid.slice(0, 12)}...</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>Value: {log.log_value}</span>
                </div>
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="mt-2 p-2 bg-gray-700/50 rounded border border-gray-600">
                  <p className="text-xs text-gray-400 mb-1">Metadata:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
