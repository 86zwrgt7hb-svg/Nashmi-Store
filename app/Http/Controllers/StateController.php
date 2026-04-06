<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StateController extends Controller
{
    public function index(Request $request)
    {
        $query = State::with('country')->withCount('cities');
        
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('name_ar', 'like', '%' . $request->search . '%');
            });
        }
        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status == '1');
        }
        
        $states = $query->orderBy('name')->paginate($request->get('per_page', 10));
        $countries = Country::active()->orderBy('name')->get();
        
        // Get region types for dynamic labels
        $regionTypes = DB::table('region_types')->get();
        
        return Inertia::render('states/index', [
            'states' => $states,
            'countries' => $countries,
            'regionTypes' => $regionTypes,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function create()
    {
        $countries = Country::active()->orderBy('name')->get();
        $regionTypes = DB::table('region_types')->get();
        
        return Inertia::render('states/create', [
            'countries' => $countries,
            'regionTypes' => $regionTypes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:10',
            'status' => 'boolean',
            'region_type_id' => 'nullable|exists:region_types,id'
        ]);

        State::create($request->all());

        return redirect()->route('states.index')->with('success', 'State created successfully.');
    }

    public function show(State $state)
    {
        $state->load(['country', 'cities']);

        return Inertia::render('states/show', [
            'state' => $state
        ]);
    }

    public function edit(State $state)
    {
        $countries = Country::active()->orderBy('name')->get();
        $regionTypes = DB::table('region_types')->get();
        
        return Inertia::render('states/edit', [
            'state' => $state,
            'countries' => $countries,
            'regionTypes' => $regionTypes
        ]);
    }

    public function update(Request $request, State $state)
    {
        $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:10',
            'status' => 'boolean',
            'region_type_id' => 'nullable|exists:region_types,id'
        ]);

        $state->update($request->all());

        return redirect()->route('states.index')->with('success', 'State updated successfully.');
    }

    public function destroy(State $state)
    {
        $state->delete();

        return redirect()->route('states.index')->with('success', 'State deleted successfully.');
    }
}
