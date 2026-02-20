import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTunnel, useTunnelFunction } from "../tunnel";

const ComponentA = () => {
  const { call } = useTunnel();

  useTunnelFunction("funcA", () => {
    toast.success("Called FuncA");
  });

  return (
    <div className="flex gap-2">
      <Button onClick={() => call("funcA")}>Call FuncA</Button>
      <Button
        onClick={() => {
          call("funcB", 1);
        }}
      >
        Call FuncB
      </Button>
    </div>
  );
};

export default ComponentA;
