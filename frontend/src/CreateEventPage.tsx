import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Calendar } from "./components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { formatTo12Hour } from "./lib/times";

const eventSchema = z
  .object({
    name: z.string().min(2).max(50),
    selectedDates: z.array(z.date()).nonempty(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine(
    (data) => {
      const start = parseInt(data.startTime.split(":")[0]);
      const end = parseInt(data.endTime.split(":")[0]);
      return end > start;
    },
    {
      message: "End time must be later than start time",
      path: ["endTime"],
    }
  );

export type EventType = z.infer<typeof eventSchema>;

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export function CreateEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = `SyncUp - Let's Sync Up!`;
  }, []);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      selectedDates: [],
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true);
    try {
      const { name, selectedDates, startTime, endTime } = values;
      const eventID = crypto.randomUUID();
      navigate(`/${eventID}`, {
        state: {
          name,
          selectedDates: selectedDates.map((date) => date.toISOString()).sort(),
          startTime,
          endTime,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 w-full max-w-xl mx-auto p-4"
      >
        <h1 className="text-2xl font-bold">Plan a New Event</h1>
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="New Event Name" {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="calendar-container w-full md:w-auto">
            <FormField
              control={form.control}
              name="selectedDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Available Dates</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border shadow-sm"
                      disabled={(date) => date < new Date()}
                      aria-label="Select available dates"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="time-selection flex flex-col gap-4 w-full md:w-64">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    aria-label="Select start time"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTo12Hour(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    aria-label="Select end time"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTo12Hour(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-center md:justify-start mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
