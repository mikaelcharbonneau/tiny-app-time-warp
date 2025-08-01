import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building } from "lucide-react";
import { fetchDatacenters, fetchDataHalls } from "@/data/locations";

const StartAudit = () => {
  const navigate = useNavigate();
  const [selectedDatacenter, setSelectedDatacenter] = useState("");
  const [selectedDataHall, setSelectedDataHall] = useState("");
  const [datacenters, setDatacenters] = useState<any[]>([]);
  const [dataHalls, setDataHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load datacenters on mount
  useEffect(() => {
    setLoading(true);
    fetchDatacenters().then((dcs) => {
      setDatacenters(dcs || []);
      setLoading(false);
    });
  }, []);

  // Load data halls when datacenter changes
  useEffect(() => {
    if (selectedDatacenter) {
      setLoading(true);
      fetchDataHalls(selectedDatacenter).then((halls) => {
        setDataHalls(halls || []);
        setLoading(false);
      });
    } else {
      setDataHalls([]);
    }
  }, [selectedDatacenter]);

  // Check for preselected datacenter from dashboard
  useEffect(() => {
    const preselected = sessionStorage.getItem('preselectedDatacenter');
    if (preselected) {
      setSelectedDatacenter(preselected);
      sessionStorage.removeItem('preselectedDatacenter');
    }
  }, []);

  const handleStartAudit = () => {
    if (selectedDatacenter && selectedDataHall) {
      // Store audit details in sessionStorage for the workflow
      sessionStorage.setItem('auditDetails', JSON.stringify({
        datacenterId: selectedDatacenter,
        dataHallId: selectedDataHall,
        datacenterName: datacenters.find(dc => dc.id === selectedDatacenter)?.name,
        dataHallName: dataHalls.find(dh => dh.id === selectedDataHall)?.name,
        startTime: new Date().toISOString(),
        technician: "John Doe"
      }));
      navigate("/audit/issues");
    }
  };
  const canStart = selectedDatacenter && selectedDataHall;
  return <div className="h-full flex items-center justify-center px-6 bg-inherit">
      <div className="w-full max-w-2xl my-0">
        <div className="mb-6 mt-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Start New Audit</h1>
          <p className="text-gray-600">Select the datacenter and data hall to begin your audit.</p>
        </div>

        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-hpe-brand" />
            <span>Location Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="datacenter">Datacenter</Label>
            <Select value={selectedDatacenter} onValueChange={setSelectedDatacenter}>
              <SelectTrigger>
                <SelectValue placeholder="Select datacenter" />
              </SelectTrigger>
              <SelectContent>
                {datacenters.map(dc => <SelectItem key={dc.id} value={dc.id}>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">{dc.name}</span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="datahall">Data Hall</Label>
            <Select value={selectedDataHall} onValueChange={setSelectedDataHall} disabled={!selectedDatacenter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a data hall" />
              </SelectTrigger>
              <SelectContent>
                {dataHalls.map(hall => <SelectItem key={hall.id} value={hall.id}>
                    {hall.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button onClick={handleStartAudit} disabled={!canStart || loading} className="bg-hpe-brand hover:bg-hpe-brand/90 text-white">
              Begin Audit
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>;
};
export default StartAudit;