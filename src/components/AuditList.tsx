import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Plus, Clipboard, FileText, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { fetchDatacenters, fetchDataHalls } from "@/data/locations";
import { supabase } from "@/integrations/supabase/client";
const AuditList = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filters, setFilters] = useState({
    datacenter: "all",
    dataHall: "all"
  });
  // Define Audit type
  interface Audit {
    id: string;
    custom_audit_id?: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
    datacenter_id?: string;
    datahall_id?: string;
    auditor_id: string;
    severity?: string;
    datacenter?: {
      name: string;
    };
    datahall?: {
      name: string;
    };
    auditor?: {
      name: string;
    };
    incidents?: {
      reported: number;
      resolved: number;
      active: number;
    };
  }
  const [audits, setAudits] = useState<Audit[]>([]);
  const [datacenters, setDatacenters] = useState<any[]>([]);
  const [dataHalls, setDataHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch audits and datacenters on mount
  useEffect(() => {
    setLoading(true);
    const fetchAll = async () => {
      const {
        data: auditsData
      } = (await supabase.from('audits').select(`
          *,
          datacenter:datacenters!audits_datacenter_id_fkey(name),
          datahall:datahalls!audits_datahall_id_fkey(name)
        `).order('created_at', {
        ascending: false
      })) as {
        data: Audit[] | null;
      };
      if (auditsData) {
        // Fetch auditor data separately since there's no FK relationship
        const auditorIds = [...new Set(auditsData.map(audit => audit.auditor_id))];
        const {
          data: auditorsData
        } = await supabase.from('auditors').select('id, name').in('id', auditorIds);

        // Fetch incidents data for all audits
        const auditIds = auditsData.map(audit => audit.id);
        const {
          data: incidentsData
        } = await supabase.from('incidents').select('audit_id, status').in('audit_id', auditIds);

        // Create incidents count map
        const incidentsMap = new Map();
        incidentsData?.forEach(incident => {
          if (!incidentsMap.has(incident.audit_id)) {
            incidentsMap.set(incident.audit_id, {
              reported: 0,
              resolved: 0,
              active: 0
            });
          }
          const counts = incidentsMap.get(incident.audit_id);
          counts.reported += 1;
          if (incident.status === 'resolved') {
            counts.resolved += 1;
          } else {
            counts.active += 1;
          }
        });

        // Map auditor names and incident counts to audits
        const auditorsMap = new Map(auditorsData?.map(auditor => [auditor.id, auditor]) || []);
        const enrichedAudits = auditsData.map(audit => ({
          ...audit,
          auditor: auditorsMap.get(audit.auditor_id),
          incidents: incidentsMap.get(audit.id) || {
            reported: 0,
            resolved: 0,
            active: 0
          }
        }));
        setAudits(enrichedAudits);
      } else {
        setAudits([]);
      }
      const dcs = await fetchDatacenters();
      setDatacenters(dcs || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Fetch data halls when datacenter changes
  useEffect(() => {
    if (filters.datacenter !== "all") {
      fetchDataHalls(filters.datacenter).then(halls => {
        setDataHalls(halls || []);
      });
    } else {
      setDataHalls([]);
    }
  }, [filters.datacenter]);

  // Reset data hall when datacenter changes
  const handleDatacenterChange = (value: string) => {
    setFilters({
      ...filters,
      datacenter: value,
      dataHall: "all"
    });
  };

  // Filter audits by date range, datacenter and data hall
  const filteredAudits = audits.filter(audit => {
    // Date range filter - make end date inclusive by setting it to end of day
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      (new Date(audit.created_at) >= dateRange.from && 
       new Date(audit.created_at) <= new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000 - 1));
    
    // Datacenter filter  
    const matchesDatacenter = filters.datacenter === "all" || audit.datacenter_id === filters.datacenter;
    
    // Data hall filter
    const matchesDataHall = filters.dataHall === "all" || audit.datahall_id === filters.dataHall;
    
    return matchesDateRange && matchesDatacenter && matchesDataHall;
  });
  const getSeverityVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'hpe';
    }
  };
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'hpe';
      case 'under review':
        return 'medium';
      case 'in progress':
        return 'low';
      default:
        return 'outline';
    }
  };
  return <div className="py-6 px-[50px] space-y-6">
      <div className="w-full space-y-6">

      {/* Filters */}
      <Card className="w-full bg-inherit py-0">
        <CardHeader className="p-6 pb-0 py-[20px]">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="">
              <CardTitle className="font-bold text-gray-900 mb-4 text-left">Audit Management</CardTitle>
            </div>
            <div className="bg-inherit"></div>
            <div className="flex justify-end">
              <Button onClick={() => navigate('/audit/start')} className="bg-hpe-brand hover:bg-hpe-brand/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Start New Audit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-full py-14px bg-white py-[14px]">
          <div className="flex justify-center items-center max-h-full h-full ">
            <div className="grid grid-cols-1 grid-cols-3 gap-8 items-stretch max-h-full w-full max-w-8xl">
            <div className="h-12">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full h-full" />
            </div>
            
            <div className="h-12">
              <Select value={filters.datacenter} onValueChange={handleDatacenterChange}>
                <SelectTrigger className="h-full">
                  <SelectValue placeholder="All Datacenters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Datacenters</SelectItem>
                  {datacenters.map(dc => <SelectItem key={dc.id} value={dc.id}>{dc.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-12">
              <Select value={filters.dataHall} onValueChange={value => setFilters({
                  ...filters,
                  dataHall: value
                })} disabled={filters.datacenter === "all"}>
                <SelectTrigger className="h-full text-center">
                  <SelectValue placeholder="All Data Halls" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data Halls</SelectItem>
                  {dataHalls.map(hall => <SelectItem key={hall.id} value={hall.id}>{hall.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit List */}
      <div className="grid gap-4">
        {filteredAudits.map(audit => <Card key={audit.id} accentColor={getSeverityVariant(audit.severity) === 'critical' ? 'border-hpe-red' : getSeverityVariant(audit.severity) === 'medium' ? 'border-hpe-orange' : getSeverityVariant(audit.severity) === 'low' ? 'border-hpe-yellow' : 'border-hpe-brand'} className="hover:shadow-hpe-brand transition-shadow cursor-pointer" onClick={() => navigate(`/audits/${audit.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Clipboard className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      {audit.datacenter?.name || 'Unknown'} / {audit.datahall?.name || 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                      {audit.auditor?.name || 'Unknown Auditor'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{audit.custom_audit_id || `Audit #${audit.id.substring(0, 8)}`}</span>
                      <span>•</span>
                      <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{audit.status}</span>
                    </div>
                  </div>
                </div>
                
                {/* Incidents Section */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Incidents</h3>
                  <div className="flex items-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{audit.incidents?.reported || 0}</div>
                      <div className="text-gray-500">Reported</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-hpe-green">{audit.incidents?.resolved || 0}</div>
                      <div className="text-gray-500">Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-black">{audit.incidents?.active || 0}</div>
                      <div className="text-gray-500">Active</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/audits/${audit.id}`)} className="flex flex-col items-center h-auto py-3 px-4">
                    <Clipboard className="h-4 w-4 mb-1" />
                    <span className="text-xs">View Details</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center h-auto py-3 px-4">
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">Generate Report</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center h-auto py-3 px-4">
                    <Share2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">Copy Link</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {filteredAudits.length === 0 && <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Clipboard className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No audits found</h3>
              <p>Try adjusting your search criteria or create a new audit.</p>
            </div>
          </CardContent>
        </Card>}
      </div>
    </div>;
};
export default AuditList;