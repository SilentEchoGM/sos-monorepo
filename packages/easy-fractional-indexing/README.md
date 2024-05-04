A convenient wrapper around [fractional-indexing](https://github.com/rocicorp/fractional-indexing/), sticking with version 2.1.0 of that library since ESM only modules are currently inconvenient for small Electron projects.
## Functions

<dl>
<dt><a href="#generateKeyBetween">generateKeyBetween(a, b, [digits])</a></dt>
<dd><p>Re-export of <code>fractional-indexing</code>&#39;s <code>generateKeyBetween</code></p>
</dd>
<dt><a href="#generateNKeysBetween">generateNKeysBetween(a, b, n, [digits])</a></dt>
<dd><p>Re-export of <code>fractional-indexing</code>&#39;s <code>generateNKeysBetween</code></p>
</dd>
<dt><a href="#move">move()</a></dt>
<dd><p>Base movement function, use <code>moveUp</code> or <code>moveDown</code> instead.</p>
</dd>
<dt><a href="#moveUp">moveUp([allIndexes], [currentIndex])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for moving current index up one position in the list.</p>
</dd>
<dt><a href="#moveDown">moveDown([allIndexes], [currentIndex])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for moving current index down one position in the list.</p>
</dd>
<dt><a href="#getStartIndex">getStartIndex()</a> ⇒ <code>string</code></dt>
<dd><p>Get the starting index for a new list.</p>
</dd>
<dt><a href="#prepend">prepend([currentIndexes])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for prepending a new index to the list.</p>
</dd>
<dt><a href="#append">append([currentIndexes])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for appending a new index to the list.</p>
</dd>
</dl>

<a name="generateKeyBetween"></a>

## generateKeyBetween(a, b, [digits])
Re-export of `fractional-indexing`'s `generateKeyBetween`

**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>string</code> \| <code>null</code> | 
| b | <code>string</code> \| <code>null</code> | 
| [digits] | <code>string</code> \| <code>undefined</code> | 

<a name="generateNKeysBetween"></a>

## generateNKeysBetween(a, b, n, [digits])
Re-export of `fractional-indexing`'s `generateNKeysBetween`

**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>string</code> \| <code>null</code> | 
| b | <code>string</code> \| <code>null</code> | 
| n | <code>number</code> | 
| [digits] | <code>string</code> \| <code>undefined</code> | 

<a name="move"></a>

## move()
Base movement function, use `moveUp` or `moveDown` instead.

**Kind**: global function  
<a name="moveUp"></a>

## moveUp([allIndexes], [currentIndex]) ⇒ <code>string</code>
Given a list of indices, get a new index for moving current index up one position in the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [allIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 
| [currentIndex] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | 

<a name="moveDown"></a>

## moveDown([allIndexes], [currentIndex]) ⇒ <code>string</code>
Given a list of indices, get a new index for moving current index down one position in the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [allIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 
| [currentIndex] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | 

<a name="getStartIndex"></a>

## getStartIndex() ⇒ <code>string</code>
Get the starting index for a new list.

**Kind**: global function  
<a name="prepend"></a>

## prepend([currentIndexes]) ⇒ <code>string</code>
Given a list of indices, get a new index for prepending a new index to the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [currentIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 

<a name="append"></a>

## append([currentIndexes]) ⇒ <code>string</code>
Given a list of indices, get a new index for appending a new index to the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [currentIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 

